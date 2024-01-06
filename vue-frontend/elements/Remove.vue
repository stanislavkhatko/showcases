<template>
  <el-icon name="trash-square"  v-tooltip="{delay: { show: 500, hide: 100 }, content: title || $t('buttons.delete')}" :class="['el-remove', {disabled: disabled}]" :title="title || $t('buttons.delete')" @click="!disabled && $emit('click')"></el-icon>
</template>

<script>
export default {
  name: "ElRemove",
  props: ['title', 'disabled']
}
</script>

<style lang="scss" scoped>

.el-remove {
  cursor: pointer;
  width: 24px;
  height: 24px;
  transition: color 0.2s ease;
  color: $red;

  &:hover {
    color: $dark-green;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
}

</style>
