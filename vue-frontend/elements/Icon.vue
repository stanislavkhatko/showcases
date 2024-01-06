<template>

  <svg v-tooltip="{delay: { show: 500, hide: 100 }, content:tooltip || title}"
       ref="icon"
       :class="[`el-icon el-icon-${name}`, {disabled: disabled}, animation]"
       @mouseover="$emit('mouseover')" @click="onClick"
       @mouseout="$emit('mouseout')">
    <use :xlink:href="`${require('@/icons/icons.svg')}#${name}`"></use>
  </svg>

</template>

<script>

export default {
  name: 'Icon',
  props: ['name', 'tooltip', 'title', 'disabled', 'animation'],
  methods: {
    onClick() {
      !this.disabled && this.$emit('click')
    },
  }
}
</script>

<style lang="scss">

.el-icon {
  color: #292D32;
  width: 24px;
  height: 24px;
  user-select: none;
  cursor: pointer;
  outline: none;

  &.animation-spin {
    animation: spin 3s infinite linear;
  }

  & * {
    pointer-events: fill;
  }

  &.disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
}


</style>
