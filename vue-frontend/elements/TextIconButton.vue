<template>
  <div class="el-text-icon-button" @click="disabled || $emit('click')"
       :class="[{disabled: disabled}, size]">
    <div class="text">
      <slot>{{ text }}</slot>
    </div>
    <div class="icon-wrapper" v-if="icon">
      <slot name="icon">
        <el-icon v-if="icon" :name="icon" class="icon"/>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TextIconButton",
  props: ['icon', 'text', 'size', 'disabled']
}
</script>

<style lang="scss" scoped>
.el-text-icon-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover .text {
    transform: translateX(5px);
  }

  &:hover .icon-wrapper {
    background: $light-green;
  }

  &.small {
    & .icon-wrapper {
      padding: 5px;
    }
  }

  & .text {
    white-space: nowrap;
    margin-right: 10px;
    font-size: $base-font;
    transition: transform 0.5s ease;

    &:first-letter {
      text-transform: capitalize;
    }
  }

  & .icon-wrapper {
    background: $dark-green;
    border-radius: 50%;
    overflow: hidden;
    transition: background 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    color: white;

    & .icon {
      width: 24px;
      height: 24px;
      color: inherit;
    }
  }

  & img {
    width: 100%;
  }
}
</style>
