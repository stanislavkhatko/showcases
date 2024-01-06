<template>

    <div class="el-datetime" >

        <el-input-label :value="label" :tooltip="labelTooltip"/>
        <date-picker class="picker" :disabled-date="disabledDate" :clearable="clearable" :value="value"
                     :value-type="valueType || 'format'" :range="range" :format="format" :type="type || 'time'"
                     :placeholder="placeholder || type === 'time' ? $t('general.enterTime') : $t('general.enterDate')"
                     @change="onInput" @focusout.native="onBlur" @focusin.native="onFocus"></date-picker>

        <el-input-error>{{ error }}</el-input-error>

    </div>

</template>

<script>
import 'vue2-datepicker/index.css';
import DatePicker from 'vue2-datepicker';

export default {
    components: {DatePicker},
    name: "Datetime",
    props: ['value', 'type', 'label', 'valueType', 'error', 'clearable', 'placeholder', 'format', 'range', 'disabledDate', 'labelTooltip'],
    methods: {
        onFocus() {
            this.$emit('focus');
            this.$emit('update:error', '');
        },
        onInput(e) {
            this.$emit('input', e);
            this.$emit('update:error', '');
        },
        onBlur() {
            this.$emit('update:error', '');
        },
    }
}
</script>

<style lang="scss" scoped>

.el-datetime {
  margin-top: 20px;

  & .picker {
    width: 100%;

    &::v-deep {

      & .mx-icon-calendar, .mx-icon-clear {
        font-size: 18px;
        color: #292D32;
        right: 7px;
      }

      & .mx-input {
        border: 1px solid $light-green;
        border-radius: $small-radius;
        font-size: 14px;
        height: 38px;
      }
    }
  }

}

</style>
