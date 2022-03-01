<template>
  <div>
    <el-form :inline="true" :model="data" size="small" label-width="100px">
      <div class="avatar-container">
        <el-tooltip effect="dark" placement="right" style="float: left">
          <div slot="content">点击修改头像<br>图片大小不超过1MB</div>
          <el-upload
            action=""
            :auto-upload="false"
            :show-file-list="false"
            accept=".png, .jpg, .jpeg"
            :on-change="selectAvatar"
          >
            <el-avatar :size="100" :src="original.avatar" fit="cover">
              <img
                alt=""
                src="data:image/png;base64,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"
              >
            </el-avatar>
          </el-upload>
        </el-tooltip>
        <div class="avatar-right">
          <div>
            <el-form-item label="昵称：" prop="nickname">
              <el-input v-model="data.nickname" placeholder="请输入昵称" />
            </el-form-item>
          </div>
          <el-form-item label="手机号：" prop="mobile">
            <el-input v-model="data.mobile" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="邮箱地址：" prop="email">
            <el-input v-model="data.email" placeholder="请输入昵称" />
          </el-form-item>
        </div>
      </div>
      <el-form-item label="性别：" prop="sex">
        <el-radio-group v-model="data.sex">
          <el-radio label="SECRET">未知</el-radio>
          <el-radio label="FEMALE">女</el-radio>
          <el-radio label="MALE">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄：" prop="age">
        <el-input-number v-model="data.age" :min="0" :max="150" style="width: 160px" />
      </el-form-item>
    </el-form>
    <el-form :model="data" size="small" label-width="100px">
      <el-form-item label="个性签名：" prop="sign">
        <el-input
          v-model="data.sign"
          :rows="3"
          type="textarea"
          maxlength="127"
          show-word-limit
          placeholder="添加个性签名"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { getInfo } from '@/api/member'
import { jsonObj2FormData } from '@/utils'

export default {
  name: 'EduTeacherAddUpdate',
  data() {
    return {
      original: {
        avatar: ''
      },
      data: {
        id: 0,
        nickname: '',
        mobile: '',
        email: '',
        password: '',
        sign: '',
        age: 0,
        sex: 0
      }
    }
  },
  created() {

  },
  methods: {
    setData(data) {
      getInfo(data.id).then(resp => {
        this.original = resp.data
        Object.keys(this.data).forEach((key) => {
          this.data[key] = this.original[key]
        })
      })
    },
    getData() {
      return jsonObj2FormData(this.data)
    },
    selectAvatar(file) {
      this.original.avatar = URL.createObjectURL(file.raw)
      this.data.file = file.raw
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

.avatar-container {
  position: relative;
  min-height: 120px;

  .avatar-right {
    position: absolute;
    top: 0;
    left: 120px;
  }
}

</style>
