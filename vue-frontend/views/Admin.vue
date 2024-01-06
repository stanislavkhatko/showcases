<template>

  <div class="p-admin">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>

</template>

<script>

export default {
  name: "Admin",
}

</script>

<style lang="scss" scoped>

.p-admin {
  background: $transparent-green;
  flex: 1;
}

</style>
