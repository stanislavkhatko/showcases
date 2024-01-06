<template>
<div class="el-to-top" v-show="$store.state.scrollTop > $store.state.windowHeight" @click="scrollTop">
  {{  $t('buttons.up') }}

  <el-icon name="arrow-up" class="icon"/>
</div>
</template>

<script>
export default {
  name: "ToTop",
  methods: {
    scrollTop() {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }
}
</script>

<style lang="scss" scoped>
.el-to-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  cursor: pointer;
  font-weight: 500;
  border-radius: $small-radius;
  border: 1px solid;
  padding: 8px 10px;
  z-index: 6;
  display: flex;
  align-items: center;
  background-color: white;
  text-transform: capitalize;


  & .icon {
    width: 18px;
    height: 18px;
    //color: $dark-green;
  }

  &:hover {
    font-weight: 500;
  }
}

</style>
