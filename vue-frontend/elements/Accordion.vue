<template>

  <div class="el-accordion">
    <div class="head">
      <div class="title" @click="onClick">
        <slot name="title">Accordion title</slot>
        <el-icon name="arrow-down" :class="['icon',{active: value}]"/>
      </div>
      <slot name="after-title" class="after-title"></slot>
    </div>

    <transition name="fade" mode="out-in">
      <div class="body" v-if="value">
        <slot></slot>
      </div>
    </transition>

  </div>

</template>

<script>
export default {
  name: "Accordion",
  props: ['value'],
  methods: {
    onClick() {
      this.$emit('click')
      this.$emit('input', !this.value)
    }
  },
}
</script>

<style lang="scss" scoped>

.el-accordion {

  & .head {
    display: flex;
    align-items: center;
  }

  & .title {
    user-select: none;
    font-weight: 500;
    display: flex;
    align-items: center;
    cursor: pointer;
    flex: 1;

    & .icon {
      margin-left: 10px;
      height: 24px;
      width: 24px;
      transition: transform 0.2s ease;

      &.active {
        transform: rotate(180deg);
      }
    }
  }
}

</style>
