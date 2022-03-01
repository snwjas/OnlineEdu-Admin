<template>
  <div class="image-container">
    <el-image :src="src" :alt="alt" :lazy="true" fit="cover" class="image">
      <div slot="error" class="image-slot">
        <slot name="error" />
      </div>
    </el-image>
  </div>
</template>

<script>
export default {
  name: 'SimpleImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }

}
</script>

<style lang="scss">
.image-container {
  width: 100%;
  padding-top: 56.25%;
  background-color: #ddd;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 5px;
  position: relative;

  .image {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    top: 0;

    .image-slot {
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);

      * {
        font-size: 24px;
        color: #909399;
      }
    }
  }
}
</style>
