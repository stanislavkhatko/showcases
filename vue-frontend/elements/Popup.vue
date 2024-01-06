<template>
  <transition name="fade" mode="out-in">
    <!-- size: small | medium  -->
    <div class="el-popup" :class="[size]" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" :style="{zIndex: zIndex}">
      <div class="wrapper">

        <div class="el-popup--top">

          <div class="el-popup--title">
            <slot name="top" ></slot>
          </div>

          <div class="el-popup--close" v-if="!hideClose" @click="$emit('close')">
            {{ $t('buttons.close')}}
            <el-icon name="close-square"  class="icon" :title="$t('buttons.close')"/>
          </div>
        </div>

        <div class="el-popup--content">
          <slot name="content"></slot>
        </div>

        <div class="el-popup--bottom">
          <slot name="bottom"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Popup",
  data() {
    return {
      isDragging: null
    }
  },
  props: {
    hideClose: Boolean, size: String, closeOutside: {type: Boolean, default: true}, zIndex: {
      type: Number,
      default: 35
    }
  },
  mounted() {
    document.body.classList.add('overflow-hidden')
  },
  beforeDestroy() {
    document.body.classList.remove('overflow-hidden')
  },
  methods: {
    onMouseDown() {
      this.isDragging = false;
    },
    onMouseMove(event) {
      if (event.target === this.$el || this.$el.contains(event.target)) {
        this.isDragging = true;
      }
    },
    onMouseUp(event) {
      if (!this.isDragging && event.target.classList.contains('el-popup') && this.closeOutside && this.$el === event.target) {
        this.$emit('close')
      }
      this.isDragging = false;
    },
    checkOrClose(e) {
      if (this.closeOutside && e.target.classList.contains('el-popup')) this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

.el-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  align-items: center;
  padding: 30px;
  overflow: scroll;
  background-color: rgba(158, 158, 158, 0.7);

  & .wrapper {
    background: white;
    border-radius: $small-radius;
    flex: 1;
    max-width: 1000px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-self: center;
    justify-self: center;
    height: 100%;
  }


  &.small .wrapper {
    max-width: 400px;
    flex: 0;
    min-height: auto;
    height: initial;
  }

  &.medium .wrapper {
    max-width: 700px;
    flex: 0;
    min-height: auto;
    height: initial;
  }

  &--top {
    position: relative;
    display: flex;
    padding: 15px;
    font-weight: 500;
    font-size: $md-font;
    align-items: flex-start;

    &:first-letter {
      text-transform: capitalize;
    }
  }

  &--title {
    flex: 1;
  }

  &--content {
    flex: 1;
    padding: 0 15px;
  }

  &--close {
    display: flex;
    margin-left: 10px;
    align-items: center;
    font-weight: normal;
    font-size: 14px;
    cursor: pointer;

    & .icon {
      color: $red;
      margin-left: 5px;

    }
  }

  &--bottom {
    display: flex;
    justify-content: flex-end;
    padding: 15px;
    position: sticky;
    z-index: 1;
    bottom: 0;
    border-radius: 10px;
  }
}
</style>
