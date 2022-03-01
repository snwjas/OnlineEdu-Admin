<template>
  <div>
    <el-form :model="data" size="small" label-width="100px">
      <el-form-item label="课程封面：" prop="cover">
        <el-upload
          action=""
          :auto-upload="false"
          :show-file-list="false"
          accept=".png, .jpg, .jpeg"
          :on-change="selectAvatar"
        >
          <el-tooltip effect="dark" content="点击上传海报，图片不能超过2MB" placement="right">
            <el-image :src="encodeOssFileUri(original.cover)" fit="cover" class="cover-img">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </el-tooltip>
        </el-upload>
      </el-form-item>
      <el-form-item label="课程名称：" prop="title">
        <el-input v-model="data.title" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item label="课程分类：" prop="subjectId">
        <el-cascader
          v-model="data.subjectId"
          :options="subjectOptions"
          :props="{ expandTrigger: 'hover', value: 'id', label: 'title' }"
          :clearable="true"
          :filterable="true"
          placeholder="请选择课程分类"
          style="width: 100%"
          @change="subjectOptionsChange"
        />
      </el-form-item>
      <el-form :model="data" :inline="true" size="small" label-width="100px">
        <el-form-item label="价格：" prop="price">
          <el-input-number v-model="data.price" :precision="2" :min="0" style="width: 160px" />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number v-model="data.sort" style="width: 160px" />
        </el-form-item>
      </el-form>
      <div>
        <p style="width: 100px;text-align: right;padding-right: 12px">课程简介：</p>
        <div id="editor" />
      </div>
    </el-form>
  </div>
</template>

<script>

import { getInfo, uploadPic } from '@/api/course'
import { getSubject } from '@/api/subject'
import { encodeOssFileUri, jsonObj2FormData } from '@/utils'
import E from 'wangeditor'

export default {
  name: 'EduCourseAddUpdate',
  data() {
    return {
      original: {
        cover: ''
      },
      data: {
        id: 0,
        title: '',
        description: '',
        price: 0.00,
        sort: 0,
        subjectId: null
      },
      editor: null,
      // 分类选项
      subjectOptions: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.initEditor()
    })
    this.getSubject()
  },
  methods: {
    setData(data) {
      getInfo(data.id).then(resp => {
        this.original = resp.data
        Object.keys(this.data).forEach((key) => {
          this.data[key] = this.original[key]
        })
        this.editor.txt.html(this.data.description)
      })
    },
    getData() {
      return jsonObj2FormData(this.data)
    },
    encodeOssFileUri(ossUri) {
      return encodeOssFileUri(ossUri)
    },
    // 选择图片事件
    selectAvatar(file) {
      this.original.cover = URL.createObjectURL(file.raw)
      this.data.file = file.raw
    },
    getSubject() {
      getSubject().then(resp => {
        this.subjectOptions = resp.data
      })
    },
    subjectOptionsChange(val) {
      const arr = val
      if (!!arr || arr.length > 0) {
        this.data.subjectId = arr[arr.length - 1]
      }
    },
    // 初始化编辑器
    initEditor() {
      const editor = this.editor = new E('#editor')
      editor.config.height = 200
      editor.config.zIndex = 1600
      editor.config.onchange = this.contentChange
      // 菜单
      editor.config.excludeMenus = ['emoticon', 'video', 'fontName', 'todo', 'code']
      // 图片
      editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
      editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png']
      editor.config.uploadImgMaxLength = 1
      editor.config.showLinkImg = false
      editor.config.customUploadImg = this.insertPicToEditor
      // 创建
      editor.create()
    },
    contentChange(html) {
      this.data.description = html
    },
    insertPicToEditor(files, insertImgFn) {
      for (const file of files) {
        uploadPic(jsonObj2FormData({ file: file })).then(resp => {
          insertImgFn(resp.data)
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.block {
  display: block;
}

.inliblock {
  display: inline-block;
}

.cover-img {
  width: 360px;
  height: 120px;
  background-color: #f5f7fa;
  line-height: 120px;
}

</style>
