<template>

  <div class="el-button-group">
    <slot></slot>
  </div>

</template>

<script>
export default {
  name: "ButtonGroup"
}
</script>

<style lang="scss" scoped>

.el-button-group {
  display: flex;

  &::v-deep {

    .el-button {

      &.link:nth-last-child(n + 2) {
        border-right: 1px solid $dark-green;
      }
    }

    .el-button:nth-last-child(n + 2) {

      &.primary {
        border-right: 1px solid white;
      }
    }

    .el-button {
      margin: 0;
      border-radius: 0;

      &:first-of-type {
        border-top-left-radius: $small-radius;
        border-bottom-left-radius: $small-radius;
      }

      &:not(:first-of-type) {
        border-left: none;
      }

      &:last-of-type {
        border-top-right-radius: $small-radius;
        border-bottom-right-radius: $small-radius;
      }
    }
  }
}
</style>
