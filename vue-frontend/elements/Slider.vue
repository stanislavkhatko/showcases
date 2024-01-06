<template>
  <div class="el-slider" >
    <VueSlider :value="value" :fixed="fixed" :minRange="minRange" :maxRange="maxRange" :data="data"
               @change="$emit('change', $event)" :data-value="dataValue" :lazy="lazy" :hideLabel="hideLabel"
               :data-label="dataLabel" :enable-cross="enableCross"
               :disabled="disabled"
               :included="included"
               :marks="marks"
               :tooltip="tooltip"
               :tooltip-formatter="tooltipFormatter"
    />
  </div>
</template>

<script>

import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';

export default {
  name: "Slider",
  props: ['value', 'fixed', 'minRange', 'maxRange', 'data', 'dataValue', 'lazy', 'hideLabel', 'dataLabel', 'enableCross', 'disabled', 'included', 'marks', 'tooltip', 'tooltipFormatter'
  ],
  components: {
    VueSlider,
  },
}
</script>

<style lang="scss" scoped>

.el-slider {
  padding: 0 30px;

  &::v-deep {
    & .vue-slider-dot {
      z-index: 1;
    }

    & .vue-slider-process {
      background: $dark-green;
    }

    & .vue-slider-dot-tooltip-inner {
      font-size: 12px;
      border-color: $dark-green;
      background-color: $dark-green;
    }
  }
}
</style>
