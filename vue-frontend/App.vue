<template>

  <div id="app" class="app">

    <router-view/>

    <Preloader v-show="$store.state.loading"/>

    <ToTop/>

  </div>

</template>

<script>
import Preloader from "@/elements/Preloader.vue";
import ToTop from "@/elements/ToTop.vue";

export default {
  name: "App",
  components: {ToTop, Preloader},
  beforeMount() {
    document.documentElement.setAttribute('lang', this.$store.getters.locale || 'en')
  },
  mounted() {
    this.$store.commit('mutateWindowWidth', window.innerWidth)
    this.$store.commit('mutateWindowHeight', window.innerHeight)
    this.$store.dispatch('actionSetShowSidebar')

    window.addEventListener('resize', () => {
      this.$store.dispatch('actionSetShowSidebar')
      this.$store.commit('mutateWindowWidth', window.innerWidth)
      this.$store.commit('mutateWindowHeight', window.innerHeight)
    })

    window.addEventListener('scroll', () => {
      this.$store.commit('mutateScrollTop', window.scrollY)
    })
  },
}

</script>

<style lang='scss'>
@import "@/scss/_variables.scss";
@import "@/scss/_main.scss";

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.1s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}


@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

</style>
