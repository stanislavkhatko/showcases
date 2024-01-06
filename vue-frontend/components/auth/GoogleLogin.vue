<template>
  <div class="c-google-login">

    <transition tag="div" name="fade" mode="out-in">

      <div style="width: 200px; height: 40px" id="google-login-button"></div>

    </transition>

  </div>
</template>

<script>
import loadScript from '@/mixins/loadScript';

export default {
  name: 'GoogleLogin',
  mixins: [loadScript],
  mounted() {
    if (import.meta.env.VITE_APP_GOOGLE_CLIENT_ID) this.loadScript('https://accounts.google.com/gsi/client').then(() => {
      window.google.accounts.id.disableAutoSelect()
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
        callback: this.handleCredentialResponse,
        context: 'use',
        cancel_on_tap_outside: false,
      })

      window.google.accounts.id.renderButton(document.getElementById('google-login-button'), {
        theme: 'outline',
        type: 'standard',
      })

    });
  },
  components: {},
  data() {
    return {
      error: '',
    };
  },
  methods: {
    handleCredentialResponse(resp) {
      const profile = this.parseJwt(resp.credential)

      this.$store.dispatch('authState/actionLogin', {
        authProvider: 'google',
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        locale: this.$store.getters.locale || 'en',
        authData: {
          id: profile.sub,
          id_token: resp.credential
        },
        platform: 'web'
      }).then(() => {
        window.location.reload();
      }).catch(err => {
        this.$emit('err', err);
      });
    },
    parseJwt(token) {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    },
    login() {
      window.google.accounts.id.prompt(info => {
        if (info.isNotDisplayed() || info.isSkippedMoment()) {
          let googleError = info.getNotDisplayedReason()

          if (googleError === 'browser_not_supported' || googleError === 'unregistered_origin' || googleError === 'unknown_reason' || googleError === 'invalid_client' || googleError === 'missing_client_id' || googleError === 'secure_http_required') {
            return this.$emit('err', this.$t('errors.error'));
          } else if (googleError === 'opt_out_or_no_session') {
            return this.$emit('err', this.$t('auth.googleOptOutOrNoSession'));
          } else if (googleError === 'suppressed_by_user') {
            return this.$emit('err', this.$t('auth.googleSuppressedByUser'));
          } else {
            return this.$emit('err', info.getNotDisplayedReason())
          }
        }
      });
    },
  }

};
</script>

<style lang='scss' scoped>

</style>
