<template>

  <label class="el-radio" :class="{'disabled': disabled}">
  <span class="radio--wrapper">
    <input type="radio" :value="value" :checked="value === returnValue" :disabled="disabled" :name="name" @change="$emit('change', returnValue)">
    <span class="radio--control"></span>
  </span>
    <span class="radio--label">{{ label }}</span>
  </label>

</template>

<script>
export default {
  name: "Radio",
  props: ['value', 'label', 'returnValue', 'name', 'disabled'],
}
</script>

<style lang="scss" scoped>

.el-radio {
  display: inline-flex;

  & .radio--label {
    text-transform: capitalize;
    line-height: 1;
    transition: 180ms all ease-in-out;
    opacity: 0.8;
  }

  & .radio--control {
    display: block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid currentColor;
    transform: translateY(-0.05em);
  }

  & input + .radio--control::before {
    content: "";
    position: absolute;
    box-shadow: inset 0.5em 0.5em currentColor;
    border-radius: 50%;
    transition: 180ms transform ease-in-out;
    transform: scale(0);
    width: 9px;
    height: 9px;
    top: 2px;
    left: 2px;
  }

  & input:checked + .radio--control::before {
    transform: scale(1);
  }

  & .radio--wrapper {
    display: flex;
    margin-right: 5px;

    & input {
      opacity: 0;
      width: 0;
      height: 0;

      &:focus + .radio--control {
        box-shadow: 0 0 0 0.05em #fff, 0 0 0.15em 0.1em currentColor;
      }
    }
  }
}

</style>