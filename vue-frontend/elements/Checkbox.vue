<template>
  <div :class="[size, {inline: typeof inline !== 'undefined'}, {disabled: typeof disabled !== 'undefined'}]"
       class="el-checkbox">

    <div class="wrapper">
      <el-input-label :value="label" :wrap="wrapLabel" class="label"/>

      <label v-if="type === 'native'" :class="size" :for="id" class="native-label">
        <input :id="id" :checked="checked" :disabled="disabled" :value="value" class="checkbox" type="checkbox"
               @change="onChange">
        <span :class="size" class="native-replacement"></span>
      </label>

      <label v-else :class="size" :for="id" class="input">
        <input :id="id" :checked="checked" :disabled="disabled" :value="value" class="checkbox" type="checkbox"
               @change="onChange">
        <span :class="size" class="replacement"></span>
      </label>

    </div>

    <el-input-error>{{ error }}</el-input-error>

  </div>
</template>

<script>
export default {
  name: "Checkbox",
  props: ['label', 'value', 'error', 'type', 'id', 'size', 'checked', 'inline', 'disabled', 'wrapLabel'],
  methods: {
    onChange(e) {
      if(!this.disabled) {
        this.$emit('change', e.target.checked)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox {
  margin-top: 20px;

  &.small {
    margin-top: 10px;
  }

  &.inline {

    & .label {
      margin-left: 7px;
    }

    & .wrapper {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: flex-end;
    }
  }

  &.disabled {
    & .input {
      opacity: 0.5;
    }

    & .replacement {
      cursor: not-allowed;
    }
  }

  & .wrapper {
    display: block;
  }

  & .native-label {
    cursor: pointer;
  }

  & .label {
    width: 100%;
    flex: 1;
    overflow: hidden;
  }

  & .input {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 38px;

    &.small {
      width: 40px;
      height: 20px;
    }

    & input {
      opacity: 0;
      width: 0;
      height: 0;
    }
  }

  & .replacement {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 38px;
  }

  & .replacement:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 6px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border-radius: 50%;
  }

  & .replacement.small:before {
    height: 15px;
    width: 15px;
    left: 4px;
    bottom: 2px;
  }


  & input:checked + .replacement {
    background-color: $dark-green;
  }

  & input:focus + .replacement {
    box-shadow: 0 0 1px $dark-green;
  }


  & input:checked + .replacement:before {
    transform: translateX(26px);
  }

  & input:checked + .replacement.small:before {
    transform: translateX(18px);
  }
}

</style>
