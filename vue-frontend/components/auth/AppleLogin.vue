<template>
  <div>
    <transition mode="out-in" name="fade" tag="div">
      <div id="appleid-signin"
           data-border="true"
           data-border-radius="5"
           data-logo-size="large"
           data-type="continue"
           style="height: 40px; width: 200px; cursor: pointer"></div>

    </transition>
  </div>

</template>

<script>
import loadScript from '@/mixins/loadScript';
import atob from "atob";

export default {
  name: 'AppleLogin',
  mixins: [loadScript],

  mounted() {

    document.addEventListener('AppleIDSignInOnSuccess', (event) => {
      this.handleAppleResponse(event.detail)
    });

    document.addEventListener('AppleIDSignInOnFailure', (event) => {
      console.log('error', event, event.detail.error);
    });

    let scriptLanguage = this.$store.getters.locale === 'de' ? 'de_DE' : 'en_US'
    this.loadScript(`https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/${scriptLanguage}/appleid.auth.js`).then((e) => {
          window.AppleID.auth.init({
            scope: 'name email',
            usePopup: true,
            scopes: ['name', 'email'],
            clientId: window.location.host,
            redirectURI: `${window.location.origin}/auth/apple`
          });

        }
    );
  },
  components: {},
  methods: {
    handleAppleResponse(detail) {

      const authData = {
        id: JSON.parse(atob(detail.authorization.id_token.split('.')[1])).sub,
        token: detail.authorization.id_token
      }

      this.$store.dispatch('authState/actionLogin', {
        authProvider: 'apple',
        locale: this.$store.getters.locale || 'en',
        authData: authData,
        platform: 'web'
      }).then(() => {
        window.location.reload();
      }).catch(err => {
        this.$emit('err', err);
      });
    },
    login: function () {
      window.location.href = `https://appleid.apple.com/auth/authorize?client_id=${env.VITE_APPLE_APP_NAME}&redirect_uri=${this.$store.state.host}/login/apple&response_type=code%20id_token&response_mode=form_post&scope=name%20email`;
    },
  }
};
</script>

<style lang='scss' scoped>

</style>
