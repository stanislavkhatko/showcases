<template>

<div class="el-json">
  <vue-json-pretty :data="json"/>
</div>

</template>

<script>
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';

export default {
  name: "Json",
  components: {VueJsonPretty},
  props: {
    json: {
      required: true
    }
  }
}

</script>

<style scoped>

.el-json {
  overflow: scroll;
  width: calc(100vw - 400px);
}

</style>
