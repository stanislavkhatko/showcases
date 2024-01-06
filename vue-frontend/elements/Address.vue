<template>

  <label class="el-address" :class="[{'disabled': disabled}]">

    <el-input-label :value="label" :tooltip="labelTooltip"/>

    <span class="input">
      <span class="before">
         <slot name="before"></slot>
      </span>

         <gmap-autocomplete style="width: 100%"
                            :value="value"
                            :placeholder="placeholder || $t('general.enterAddress')"
                            @place_changed="onChanged" @input="onInput">
          </gmap-autocomplete>

      <span class="after">
            <slot name="after"></slot>
      </span>
    </span>


    <el-input-error>{{ error }}</el-input-error>

  </label>

</template>

<script>
export default {
  name: "Address",
  props: ['value', 'placeholder', 'error', 'label', 'disabled', 'autofocus', 'labelTooltip'],
  methods: {
    onFocus() {
      this.$emit('focus');
      this.$emit('update:error', '');
    },
    onInput(e) {
      this.$emit('input', e.target.value);
      this.$emit('update:error', '');
    },
    onChanged(googleAddress) {
      this.$emit('onChanged', googleAddress);
      this.$emit('update:error', '');
    },
    onBlur() {
      this.$emit('update:error', '');
    },
  }
}
</script>

<style lang="scss" scoped>

.el-address {
  margin-top: 20px;
  display: block;

  & .input {
    display: flex;
    position: relative;

    & .after {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    & ::v-deep input {
      width: 100%;
      font-size: 14px;
      background: white;
      display: block;
      border: 1px solid $light-green;
      border-radius: $small-radius;
      padding: 9px 20px 9px 11px;

      & input::placeholder {
        color: $placeholder-grey;
      }
    }
  }

  &.disabled {
    & input {
      cursor: not-allowed;
    }
  }
}
</style>
