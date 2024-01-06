<template>
  <div class="p-pdf">
    <a v-if="url" class="router-link-inherit" style="cursor: pointer" :href="url" target="_blank">{{
        $t('buttons.open')
      }}</a>
    <div class="error" v-if="error">{{ $t('buttons.somethingWentWrong') }}</div>
  </div>
</template>

<script>

export default {
  name: "Pdf",
  title: 'Pdf',
  data() {
    return {
      url: null,
      error: false
    }
  },
  beforeMount() {
    this.$store.dispatch('processState/actionProcessPdfLink', this.$route.params.id).then(pdf => {

      if (pdf.error) {
        this.error = true
      } else {
        if (pdf.file && pdf.file.url) {
          this.url = pdf.file.url
          window.open(pdf.file && pdf.file.url)
        }
      }
    }).catch(e => {
      console.log('catch', e);
    })
  }
}

</script>


<style lang="scss">
.p-pdf {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px 15px;
  min-height: 100vh;
  @include dashboard-content-background;

  & .title {
    font-weight: 500;
    font-size: $lg-font;
    margin-top: 30px;
  }
}
</style>
