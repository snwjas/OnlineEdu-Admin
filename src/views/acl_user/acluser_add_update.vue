<template>
  <div>
    <el-form ref="form" :model="data" size="small" label-width="80px">
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="data.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="角　色：" prop="roleId">
        <el-select v-model="data.roleId" style="width: 100%" filterable>
          <el-option
            v-for="role in roleList"
            :key="role.id"
            :value="role.id"
            :label="role.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="昵　称：" prop="nickname">
        <el-input v-model="data.nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="备　注：" prop="mark">
        <el-input
          v-model="data.mark"
          :rows="3"
          type="textarea"
          maxlength="255"
          show-word-limit
          placeholder="为该账户添加备注"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { listAll } from '@/api/role'

export default {
  name: 'AcluserAddUpdate',
  data() {
    return {
      data: {
        id: null,
        username: '',
        roleId: null,
        nickname: '',
        mark: ''

      },
      roleList: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    setData(data) {
      const original = JSON.parse(JSON.stringify(data))
      Object.keys(this.data).forEach((key) => {
        this.data[key] = original[key]
      })
    },
    getData() {
      return this.data
    },
    // 获得角色列表
    getRoleList() {
      listAll(true).then(resp => {
        this.roleList = resp.data
      })
    }
  }
}
</script>

<style scoped>

</style>
