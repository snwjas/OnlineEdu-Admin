<template>
  <section class="app-main" style="display: flex;flex-direction: column;">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" style="flex: 1" />
    </transition>
    <div class="footer">
      Powered by <a href="https://refrain.xyz" target="_blank">Myles Yang</a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped lang="scss">
.app-main {
  /*50 = navbar  */
  // min-height: calc(100vh - 50px);
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.footer {
  width: 100%;
  padding: 16px 0 12px 0;
  text-align: center;
  color: #757575;
  font-size: 13px;

  a {
    color: #20a0ff;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
