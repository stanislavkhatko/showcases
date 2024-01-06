<template>

<div class="el-infinite-loader">
      <infinite-loading :distance="distance || 100" :throttleLimit="throttleLimit || 500" :identifier="id" @infinite="scroll" spinner="bubbles">
        <!--    <div v-slot:spinner>Loading...</div>-->
        <div slot="no-more">{{ labelNoMore}}</div>
        <div slot="no-results">{{ labelNoResults }}</div>
      </infinite-loading>
</div>

</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';

export default {
  name: "InfiniteLoader",
  props: ['id', 'labelNoResults', 'labelNoMore', 'distance', 'throttleLimit'],
  components: {
    InfiniteLoading,
  },
  methods: {
    scroll(e) {
      this.$emit('scroll', e)
    }
  }
}
</script>

<style scoped>

</style>
