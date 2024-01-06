<template>

    <label class="el-input" :class="[{'disabled': disabled}, size]">

        <el-input-label :value="label" :tooltip="labelTooltip"/>

        <span class="input">
      <span class="before">
         <slot name="before"></slot>
      </span>

        <input :data-lpignore="typeof dataLpignore !== undefined ? dataLpignore : true"
               class="el-input--input" :type="type || 'input'" :autofocus="typeof autofocus !== 'undefined'"
               :disabled="disabled" :value="value"
               @blur="onBlur" @focus="onFocus"
               @keyup.enter="onEnter"
               :placeholder="placeholder || $t('general.addText')"
               :maxlength="maxLength"
               @input="onInput" :min="min" :max="max"/>

      <span class="after">
            <span class="maxlength" v-if="maxLength">{{ `${(value && value.length) || 0}/${maxLength}` }}</span>

            <slot name="after"></slot>
      </span>
    </span>

        <el-input-error>{{ error }}</el-input-error>

    </label>

</template>

<script>
export default {
    name: "Input",
    props: ['value', 'placeholder', 'size', 'min', 'max', 'maxLength', 'error', 'label', 'type', 'disabled', 'autofocus', 'labelTooltip', 'dataLpignore'],
    methods: {
        onFocus() {
            this.$emit('focus');
            this.$emit('update:error', '');
        },
        onInput(e) {
            this.$emit('input', e.target.value);
            this.$emit('update:error', '');
        },
        onEnter(e) {
            this.$emit('update:error', '');
            this.$emit('enter', e.target.value)
        },
        onBlur() {
            this.$emit('blur')
            this.$emit('update:error', '');
        },
    },
}
</script>

<style lang="scss" scoped>

.el-input {
  margin-top: 20px;
  display: block;

  &.small {
    margin-top: 10px;

    & .el-input--input {
      font-size: $base-font;
      padding: 7px 11px;
    }
  }

  & .input {
    display: flex;
    position: relative;
    border: 1px solid $light-green;
    border-radius: $small-radius;
    overflow: hidden;

    & .after {
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;

      & .maxlength {
        padding: 0 5px;
        font-size: 12px;
      }
    }
  }

  & input {
    width: 100%;
    font-size: 14px;
    background: white;
    display: block;
    padding: 9.5px 11px;

    & input::placeholder {
      color: $placeholder-grey;
    }
  }

  &.disabled {
    & input {
      cursor: not-allowed;
      color: gray;
    }
  }
}
</style>
