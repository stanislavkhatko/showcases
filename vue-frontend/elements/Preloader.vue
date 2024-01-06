<template>
  <div class="el-preloader">
    <img class="preloader--icon" alt="preloader" :src="require('@/assets/new_preloader.svg')"/>
  </div>
</template>

<style lang="scss">
  .el-preloader {
    position: fixed;
    z-index: 999;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: progress;

    & .preloader--icon {
      width: 60px;
      height: 60px;
      display: block;
    }
}
</style>
