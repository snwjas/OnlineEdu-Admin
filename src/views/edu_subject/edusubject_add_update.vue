<template>
  <div>
    <el-form :model="data" size="small" label-width="100px">
      <el-form-item label="分类名称：" prop="title">
        <el-input v-model="data.title" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类排序：" prop="sort">
        <el-input-number v-model="data.sort" style="width: 160px" />
      </el-form-item>
      <el-form-item label="分类状态：" prop="enable">
        <el-radio-group v-model="data.enable">
          <el-radio :label="true">启用</el-radio>
          <el-radio :label="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'EduSubjectAddUpdate',
  data() {
    return {
      data: {
        id: 0,
        title: '',
        enable: true,
        sort: 0
      }
    }
  },
  created() {

  },
  methods: {
    setData(data) {
      Object.keys(this.data).forEach((key) => {
        this.data[key] = data[key]
      })
    },
    getData() {
      return this.data
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
