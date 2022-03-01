<template>
  <div>
    <el-form ref="passwordForm" label-position="top" :model="password" size="small">
      <el-form-item label="原密码：" prop="oldPassword">
        <el-input v-model="password.oldPassword" show-password />
      </el-form-item>
      <el-form-item label="新密码：" prop="newPassword">
        <el-input v-model="password.newPassword" show-password />
      </el-form-item>
      <el-form-item label="确认新密码：" prop="confirmNewPassword">
        <el-input v-model="password.confirmNewPassword" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePassword">更 改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updatePassword } from '@/api/user'

export default {
  name: 'RPassword',
  data() {
    return {
      password: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }
    }
  },
  methods: {
    updatePassword() {
      updatePassword(this.password).then(resp => {
        if (resp.status === 200) {
          this.$message.success(resp.message)
          this.$refs['passwordForm'].resetFields()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
