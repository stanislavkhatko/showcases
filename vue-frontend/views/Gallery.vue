<template>

  <div class="p-gallery" >

    <MovedPhotoProjectForm/>
    <ReportForm/>

    <div class="gallery">
      <GalleryElastic/>
    </div>

  </div>

</template>

<script>
import ReportForm from "@/components/popups/ReportForm.vue";
import MovedPhotoProjectForm from "@/components/MovedPhotoProjectForm.vue";
import GalleryElastic from "@/components/GalleryElastic.vue";
import {i18n} from "@/plugins/i18n";

export default {
  title: i18n.t('pages.gallery'),
  components: {
    GalleryElastic,
    MovedPhotoProjectForm,
    ReportForm,
  }
};
</script>

<style lang="scss" scoped>

.p-gallery {
  flex: 1;
  @include dashboard-content-background;
  display: flex;
  flex-direction: column;

  & .gallery {
    margin: 60px 0 0 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

</style>
