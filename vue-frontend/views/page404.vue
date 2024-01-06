<template>
  <div class="p-404">

    <img v-else style="max-width: 300px; width: 100%" :src="require('@/assets/logo_new.svg')" alt="logo">

    <div class="title">{{ $t('notification.pageNotFound') }}</div>

    <el-button style="margin-top: 20px;" @click="() => $router.push({path: '/'})">{{
        $t('buttons.backToHome')
      }}
    </el-button>
  </div>
</template>

<script>
export default {
  name: "page404",
  title: 'Page not found | 404',

}
</script>

<style lang="scss" scoped>

.p-404 {
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
