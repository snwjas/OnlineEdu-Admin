<template>
  <el-row style="position: relative" class="course">
    <el-col :span="17" style="position: relative">
      <div style="padding-top: 70%" />
      <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;">
        <div id="J_prismPlayer" />
      </div>
    </el-col>
    <el-col :key="refreshKey" :span="7" class="selection">
      <div v-for="chapter of chapterData" :key="chapter.id" class="chapter">
        <div class="title ellipsis" :title="chapter.title">{{ chapter.title }}</div>
        <div
          v-for="(value) of videoData[chapter.id]"
          :key="`${chapter.id}:${value.id}`"
          :class="{'video':true,'active':activeItem===`${chapter.id}:${value.id}`}"
          @click="play(value.videoId);activeItem=`${chapter.id}:${value.id}`;"
        >
          <div class="title ellipsis" :title="value.title">
            <i v-if="value.oid>0" class="el-icon-video-play" />
            <el-badge v-else is-dot>
              <i class="el-icon-video-play" />
            </el-badge>
            {{ value.title }}
          </div>
          <div class="info">
            <span class="duration">时长: {{ value.duration }}</span>
            <span v-if="value.free" class="free">免费</span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { listChaptersTmp as listChapters } from '@/api/chapter'
import { listVideosTmp as listVideos, getPlayAuth } from '@/api/video'

export default {
  name: 'EducourseWatch',
  data() {
    return {
      courseId: null,
      player: null,
      chapterData: [],
      // <chapterId, videoList>
      videoData: {},
      refreshKey: false,
      activeItem: ''
    }
  },
  methods: {
    setData(courseId) {
      this.courseId = courseId
      this.listChaptersAndVideos(courseId)
    },
    listChaptersAndVideos(courseId) {
      listChapters(courseId).then(resp => {
        this.chapterData = resp.data
        let len = resp.data.length
        for (const c of resp.data) {
          listVideos(c.id).then(resp => {
            this.videoData[c.id] = resp.data
            // 获取完视频列表
            if (--len <= 0) {
              // 关键：强制刷新组件渲染
              this.refreshKey = !this.refreshKey
              // 准备第一个视频
              try {
                const firstChapterId = this.chapterData[0].id
                const firstVideo = this.videoData[firstChapterId][0]
                this.play(firstVideo.videoId)
                // 设置第一个视频激活
                this.activeItem = `${firstChapterId}:${firstVideo.id}`
              } catch (e) {
                console.log(e)
              }
            }
          })
        }
      })
    },
    play(videoSourceId) {
      if (this.player) {
        // const autoPlay = this.player.getStatus() === 'playing'
        // 销毁播放器
        this.player.dispose()
        this.player = null
        document.getElementById('J_prismPlayer').innerHTML = ''
        getPlayAuth(videoSourceId).then(resp => {
          // eslint-disable-next-line no-undef
          this.player = new Aliplayer({
            id: 'J_prismPlayer',
            autoplay: false,
            width: '100%',
            height: '100%',
            vid: videoSourceId,
            playauth: resp.data
          })
        })
      } else {
        getPlayAuth(videoSourceId).then(resp => {
          // eslint-disable-next-line no-undef
          this.player = new Aliplayer({
            id: 'J_prismPlayer',
            autoplay: false,
            width: '100%',
            height: '100%',
            vid: videoSourceId,
            playauth: resp.data
          })
        })
      }
    },
    dispose() {
      if (this.player) {
        this.player.dispose()
        document.getElementById('J_prismPlayer').innerHTML = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">

.course {
  .selection {
    position: absolute;
    right: 0;
    height: 100%;
    padding: 20px 16px;
    overflow: auto;
    background-color: #232323;
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #64a5ff;
    }
    &::-webkit-scrollbar-track {
      background: #232323;
    }
  }
}

.chapter {
  color: #c7c7c7;
  margin-top: 16px;

  > .title {
    font-size: 16px;
  }

  .video {
    font-size: 14px;
    margin-top: 16px;
    cursor: pointer;

    i {
      margin-right: 6px;
    }

    &:hover,&.active {
      color: #20a0ff;

      .duration {
        color: #20a0ff;
      }
    }

    .info {
      font-size: 12px;
      margin: 5px 0 0 20px;
      color: #777777;

      span {
        margin-right: 12px;

        &:last-child {
          margin-right: 0;
        }
      }

      .free {
        color: #ff4f23;
      }
    }
  }
}
</style>
