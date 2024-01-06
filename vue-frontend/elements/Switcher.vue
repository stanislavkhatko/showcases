<template>

  <div class="el-switcher" @mouseenter="$emit('mouseenter')" @mouseleave="$emit('mouseleave')"
       :class="[size, {inline: typeof inline !== 'undefined'}, {disabled: typeof disabled !== 'undefined'}]">

    <div class="wrapper">
      <el-input-label class="label" :value="label" :tooltip="labelTooltip"/>

      <div class="group">

        <div class="inputs">
          <label>
            <input type="radio" :checked="value === false || value === 'false'" @change="onChange" :disabled="disabled"
                   value="false"
                   :name="id"/>
            <span class="replacement">{{ noOption || $t('buttons.no') }}</span>
          </label>
          <label>
            <input type="radio" :checked="value === '' || value === undefined" @change="onChange" :disabled="disabled"
                   value=""
                   :name="id"/>
            <span class="replacement">{{ noneOption || $t('buttons.none') }}</span>
          </label>
          <label>
            <input type="radio" :checked="value === true || value === 'true'" @change="onChange" :disabled="disabled"
                   value="true"
                   :name="id"/>
            <span class="replacement">{{ yesOption || $t('buttons.yes') }}</span>
          </label>
        </div>

        <slot class="after" name="after"></slot>

      </div>

    </div>

    <el-input-error>{{ error }}</el-input-error>

  </div>


</template>

<script>
export default {
  name: "Switcher",
  data() {
    return {
      id: Math.random().toString(36).substring(2, 8)
    }
  },
  props: ['label', 'value', 'error', 'size', 'inline', 'disabled', 'noOption', 'noneOption', 'yesOption', 'labelTooltip'],
  methods: {
    onChange(e) {
      this.$emit('update:error', '');
      this.$emit('change', e.target.value)
      this.$emit('input', e.target.value)
      this.$emit('blur');
    },
  }
}
</script>

<style lang="scss" scoped>

.el-switcher {
  margin-top: 20px;

  & label {
    display: flex;
    cursor: pointer;
  }

  &.disabled {

    & label {
      cursor: not-allowed;
    }
  }

  & .group {
    display: flex;
    justify-content: flex-start;
    flex-direction: row-reverse;
  }

  & input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  & .inputs {
    display: flex;
    height: 38px;
    border: 1px solid $light-green;
    overflow: hidden;
    border-radius: $small-radius;
  }

  & .replacement {
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    font-size: 14px;
    padding: 5px 10px;
    transition: all 0.3s ease;

    &:hover {
      background: $light-green;
    }
  }

  & input:checked + .replacement {
    background-color: $dark-green;
    color: white;
  }

}
</style>
