<template>
  <div>
    <el-form ref="profileForm" label-position="top" :model="user" size="small">
      <el-form-item label="用户名：" prop="username">
        <el-input :value="user.username" disabled />
      </el-form-item>
      <el-form-item label="昵称：" prop="nickname">
        <el-input v-model="user.nickname" />
      </el-form-item>
      <el-form-item label="个性签名：" prop="sign">
        <el-input v-model="user.sign" :rows="5" type="textarea" maxlength="255" show-word-limit />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateProfile">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateProfile } from '@/api/user'

export default {
  name: 'RProfile',
  data() {
    return {
      user: { ...this.$store.getters.user }
    }
  },
  methods: {
    updateProfile() {
      const user = { ...this.user }
      delete user.avatar
      updateProfile(user).then(resp => {
        this.$message.success(resp.message)
        if (resp.data) {
          this.$store.dispatch('user/setInfo', resp.data)
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
