<template>

  <div class="el-info-box">
    <div class="wrapper">
      <div class="icon">
        <img draggable="false" :src="image || require('@/assets/info_picture.svg')">
      </div>
      <div class="info">
        <slot></slot>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: "InfoBox",
  props: ['image']
}
</script>

<style lang="scss" scoped>

.el-info-box {
  display: flex;

  & .wrapper {
    display: flex;
    border-radius: $small-radius;
    padding: 20px 20px 20px 10px;
    font-size: $base-font;
    background: white;
    flex-wrap: wrap;

    & .icon {
      display: flex;
      flex-wrap: wrap;
      margin-right: 20px;

      & img {
        max-width: 100%;
      }

      @include phone {
        margin-right: 0;
      }
    }

    & .info {
      flex: 1;
    }
  }
}

</style>
