<template>
  <div class="el-input-error">
    <div class="error">
        <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputError",
}
</script>

<style lang="scss" scoped>

.el-input-error {
  padding-left: 12px;
  position: relative;

  & .error {
    font-size: 12px;
    font-weight: 500;
    color: red;
    position: absolute;
    transition: all 0.3s ease;
  }
}

</style>