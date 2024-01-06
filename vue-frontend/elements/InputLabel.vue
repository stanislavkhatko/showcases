<template>

  <div class="el-input-label" v-if="value" :class="[{wrap: wrap, 'has-tooltip': !!tooltip}]">
    <div class="wrapper">
      <div class="label" v-html="value"></div>
      <div class="desc" v-if="showTooltip" v-html="tooltip"></div>

    </div>
    <el-icon v-if="tooltip && !showTooltip" @click="showTooltip = !showTooltip" name="information" class="information"/>
    <el-icon v-if="tooltip && showTooltip" @click="showTooltip = !showTooltip" name="arrow-down" class="information"/>

  </div>

</template>

<script>
export default {
  name: "InputLabel",
  props: ['value', 'wrap', 'tooltip'],
  data() {
    return {
      showTooltip: false
    }
  }
}
</script>

<style lang="scss" scoped>

.el-input-label {
  display: flex;
  padding-bottom: 5px;

  & .wrapper {
    flex: 1;
  }

  & .information {
    transform: rotate(180deg);
    height: 20px;
    width: 20px;
    position: relative;
    min-width: 20px;
    margin-right: 5px;
    //top: 3px;
  }

  & .label {
    font-size: 12px;
    font-weight: 500;
    //padding-left: 11px;
    //white-space: nowrap;
    //text-transform: capitalize;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  & .desc {
    font-size: 12px;
    padding-left: 10px;
    white-space: pre-wrap;
    border-left: 1px solid $light-green;
    margin: 10px 0 5px 11px;
  }
}
</style>
