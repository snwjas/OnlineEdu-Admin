<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
#nprogress {
  .bar {
    z-index: 15031;
  }

  .spinner {
    z-index: 15031;
  }
}
</style>
