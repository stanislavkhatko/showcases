<template>

  <form class="c-auth-restore" autocomplete="off" @submit.prevent="submit">

    <el-input :value="email"
              name="email"
              :placeholder="$t('auth.emailPlaceholder')"
              type="email"
              @input="mutateEmail"
              :label="$t('auth.emailLabel')" :error.sync="$store.state.authState.emailError"/>

    <div class="buttons">
      <el-button button-type="submit">{{ $t('auth.restore') }}</el-button>
      <router-link class="router-link-inherit" style="margin-left: 20px;" to="/auth/login">{{
          $t('auth.login')
        }}
      </router-link>
    </div>

    <div class="success" v-if="successMessage" v-html="successMessage"></div>

  </form>

</template>

<script>
import {mapGetters, mapMutations, mapState} from 'vuex';
import validateHelpers from '@/mixins/validateHelpers.js';


export default {
  title: 'Restore password',
  name: 'Restore',
  mixins: [validateHelpers],
  data() {
    return {
      error: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapState('authState', ['email', 'emailError']),
    ...mapGetters(['isLoading']),
  },
  methods: {
    ...mapMutations('authState', ['mutateEmail', 'mutateEmailError']),
    submit() {
      if (!this.email || !this.validateEmail(this.email)) {
        this.mutateEmailError(this.$t('auth.emailIncorrect'))
        return;
      }

      let emailHtml = '<b>' + this.email + '</b>'
      this.$store.dispatch('userState/actionUserRestorePassword', {email: this.email,}).then(() => {
        this.successMessage = this.$tc('auth.emailSent', emailHtml, {n: emailHtml});
        this.mutateEmail('')
      }).catch(err => {
        console.log(err);
        this.setError(this.$t('auth.emailIncorrect'));
      });
    },
    setError: function (err) {
      this.error = err;
    },
  },
  beforeDestroy() {
    this.$store.commit('authState/mutateEmailError', '');
  }
};
</script>

<style lang='scss' scoped>

.c-auth-restore {
  max-width: 400px;
  margin: 0 auto;

  & .buttons {
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & .success {
    color: $dark-green;
    text-align: center;
    margin-top: 10px;
    font-size: $sm-font;
  }
}


</style>
