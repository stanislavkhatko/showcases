<template>
  <div class="el-textarea">
    <el-input-label :value="label" :tooltip="labelTooltip"/>

    <textarea-autosize
        :placeholder="placeholder || $t('general.addText')"
        :value="computedValue"
        :maxlength="maxLength"
        @input="onInput"
        :min-height="minHeight || 30"
        :max-height="350"
        @focus.native="$emit('focus')"
        @blur.native="$emit('blur')"
    />
    <div class="maxlength" v-if="maxLength">{{ `${(value && value.length) || 0}/${maxLength}` }}</div>


    <el-input-error>{{ error }}</el-input-error>

  </div>
</template>

<script>
export default {
  name: "Textarea",
  props: ['label', 'value', 'placeholder', 'error', 'minHeight', 'maxLength', 'labelTooltip'],
  computed: {
    computedValue() {
      return this.value;
    },
  },
  methods: {
    onInput($event) {
      if ($event !== this.value) {
        this.$emit('input', $event)
        this.$emit('update:error', '');
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.el-textarea {
  margin-top: 20px;
  display: block;

  & .maxlength {
    padding: 0 5px;
    font-size: 12px;
    text-align: right;
  }

  & .status {
    position: relative;

    &-icon {
      position: absolute;
      top: -25px;
      right: 7px;

      & .el-icon {
        width: 20px;
        height: 20px;
        opacity: 0.5;
        cursor: default;
      }
    }

  }

  & textarea {
    width: 100%;
    font-size: 14px;
    background: white;
    display: block;
    padding: 9px 11px;
    border: 1px solid $light-green;
    border-radius: $small-radius;

    &::placeholder {
      color: $placeholder-grey;
    }
  }
}
</style>
