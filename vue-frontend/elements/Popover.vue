<template>
  <v-popover class="el-popover">

    <slot></slot>

    <template v-slot:popover>
      <slot name="content"></slot>
    </template>

  </v-popover>
</template>

<script>
export default {
  name: "Popover"
}
</script>

<style lang="scss">

.el-popover {

  &::v-deep .trigger {
    display: flex;
  }

}

/// Tooltip plugin
.el-tooltip {
  display: block !important;
  z-index: 100;
  font-size: 12px;

  .tooltip-inner {
    background: white;
    color: black;
    border-radius: $small-radius;
    padding: 5px 10px 4px;
    border: 1px solid;
    max-width: 300px;

    &:first-letter {
      text-transform: uppercase;
    }
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: $dark-green;
    z-index: 100;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition: opacity .15s, visibility .15s;
  }

  &[aria-hidden='false'] {
    visibility: visible;
    opacity: 1;
    transition: opacity .15s;
  }

  &.info {
    $color: rgba(#004499, .9);

    .tooltip-inner {
      background: $color;
      color: white;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, .1);
    }

    .tooltip-arrow {
      border-color: $color;
    }
  }

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      color: black;
      border-radius: 10px;
      box-shadow: 0 0 2px black;
      border: none;
      padding: 0;
    }

    .popover-arrow {
      border-color: black;
    }
  }
}


</style>
