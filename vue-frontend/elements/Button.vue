<template>

  <button class="el-button" :type="buttonType || 'button'"
          :class="[{'disabled': disabled}, type ? type : 'primary', size, {resize: resize}, {'no-text': typeof noText !== 'undefined'}]"
          @click="disabled || $emit('click')">

    <span class="el-button--text">
          <slot></slot>
    </span>

    <span class="el-button--icon">
          <slot name="icon"><el-icon style="cursor: inherit" v-if="icon" :name="icon" class="icon"/></slot>
    </span>

  </button>

</template>

<script>
export default {
  name: "Button",
  props: ['disabled', 'type', 'size', 'button-type', 'icon', 'resize', 'noText']
}
</script>

<style lang="scss" scoped>

.el-button {
  outline: none;
  font: inherit;
  margin: 0;
  height: 38px;
  font-size: 14px;
  user-select: none;
  cursor: pointer;
  padding: 0 7px;
  font-weight: 500;
  border-radius: $small-radius;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  white-space: nowrap;
  background: $dark-green;
  color: white;
  border: 1px solid $dark-green;

  &:first-letter {
    text-transform: capitalize;
  }


  &.resize {

    & .el-button--text {
      @include note {
        display: none;
      }
    }

    & .el-button--icon .icon {
      @include note {
        margin-left: 0 !important;
      }
    }
  }

  &--text + .el-button--icon .icon {
    margin-left: 7px;
  }

  &.no-text .el-button--icon .icon {
    margin-left: 0;
  }

  &--icon {
    display: flex;

    & .icon {
      width: 24px;
      height: 24px;
      color: inherit;
    }
  }

  // type
  &.warning {
    background: $pastel-orange;
  }

  // Type
  &.secondary {
    background: white;
    color: black;

    &:hover:not(.disabled) {
      color: $dark-green;
      background: white;
    }
  }

  // Type
  &.link {
    background: transparent;
    color: black;
    border: none;

    &.active, &:hover {
      background: transparent !important;
      text-decoration: underline;
      color: $dark-green;
    }
  }

  &.disabled {

    &.secondary {
      background: none;
    }

    color: $black;
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.small {
    font-size: 12px;
    height: 28px;

    .el-button--icon {
      display: flex;

      & .icon {
        width: 20px;
        height: 20px;
        color: inherit;
      }
    }
  }

  &.large {
    height: 48px;
    font-size: 16px;
  }

  &:hover:not(.disabled) {
    color: $black;
    background: white;
  }
}

</style>
