<template>
  <div class="el-table" :class="{disabled: disabled}" >
    <ve-table :scrollWidth="scrollWidth" :columns="columns" :fixed-header="fixedHeader" :expand-option="expandOption"
              :table-data="tableData" :columnHiddenOption="columnHiddenOption"/>
  </div>
</template>

<script>
export default {
  name: "Table",
  props: ['columns', 'scrollWidth', 'fixedHeader', 'tableData', 'expandOption', 'columnHiddenOption', 'disabled'],
}
</script>

<style lang="scss" scoped>

.el-table {

  &.disabled {
    opacity: 0.5;
  }

  &::v-deep .ve-table-body-td {
    vertical-align: top !important;
  }

  &::v-deep .ve-table {
    border-radius: $small-radius;
  }

  &::v-deep .ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header.ve-table-fixed-header tr th {
    z-index: initial;
  }

}

</style>
