<template>

<div class="el-table-pagination">
  <ve-pagination class="pagination" @on-page-number-change="$emit('pageChange', $event - 1)" :total="total || 1" :pageSize="pageSize || 100" :pageIndex="pageIndex || 1" :layout="layout || ['total', 'prev', 'pager', 'next']" />
</div>

</template>

<script>
export default {
  name: "TablePagination",
  props: ['total', 'pageSize', 'layout', 'pageIndex']
}
</script>

<style lang="scss" scoped>

.el-table-pagination {
  display: flex;
  align-items: flex-end;

  & .pagination {
    background: inherit;
  }
}

</style>