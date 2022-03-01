<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 一些信息 -->
      <el-col :xs="24" :sm="10">
        <el-card class="info-card">
          <div slot="header">信息</div>
          <v-l-info />
        </el-card>
      </el-col>
      <!-- 一些设置 -->
      <el-col :xs="24" :sm="14">
        <el-card class="sitting-card">
          <div slot="header">设置</div>
          <el-tabs type="border-card">
            <!-- 基本资料 -->
            <el-tab-pane>
              <span slot="label"><i class="tabs-icon el-icon-postcard" />基本资料</span>
              <v-r-profile />
            </el-tab-pane>
            <!-- 登录密码 -->
            <el-tab-pane>
              <span slot="label"><i class="tabs-icon el-icon-lock" />登录密码</span>
              <v-r-password />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'Profile',
  components: {
    'v-r-profile': () => import('@/views/profile/r-profile'),
    'v-r-password': () => import('@/views/profile/r-password'),
    'v-l-info': () => import('@/views/profile/l-info')
  },
  data() {
    return {}
  },

  methods: {}
}
</script>

<style lang="scss">

.el-card {
  &__header, &__body {
    padding: 12px;
  }
}

.sitting-card {
  .el-card__body {
    padding: 0;
  }

  .el-tabs {
    border-top: none;
    border-left: none;
    border-right: none;
  }

  .tabs-icon {
    margin-right: 5px;
  }
}
</style>

<style scoped lang="scss">

</style>
