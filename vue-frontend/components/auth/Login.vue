<template>
  <form class="c-auth-login" autocomplete="off" @submit.prevent="submit">

    <el-input :value="email"
              :data-lpignore="false"
              name="email"
              :placeholder="$t('auth.emailPlaceholder')"
              type="email"
              @input="mutateEmail"
              :label="$t('auth.emailLabel')" :error.sync="$store.state.authState.emailError"/>

    <el-input :value="password"
              :data-lpignore="false"
              name="password"
              :placeholder="$t('auth.passwordPlaceholder')"
              :type="passwordType"
              @input="mutatePassword"
              :label="$t('auth.passwordLabel')" :error.sync="$store.state.authState.passwordError">
      <template v-slot:after>
        <div class="password-after">
          <el-icon name="eye" v-if="passwordType === 'password'" @click="passwordType = 'input'"/>
          <el-icon name="eye-slash" v-if="passwordType === 'input'" @click="passwordType = 'password'"/>
        </div>
      </template>
    </el-input>

    <div class="forgot">
      <router-link class="router-link-inherit" to="/auth/restore">{{ $t('auth.forgotPassword') }}</router-link>
    </div>


    <div class="buttons">
      <el-button buttonType="submit">{{ $t('auth.login') }}</el-button>
      <router-link style="margin-left: 10px;" :to="{name: 'Register'}" class="register router-link-inherit">
        {{ $t('auth.register') }}
      </router-link>
    </div>

    <div class="error" v-if="error" v-html="error"></div>


    <div class="social-buttons">
      <GoogleLogin @err="setError"/>
      <AppleLogin style="margin-top: 10px;" @err="setError">{{ $t('auth.appleLogin') }}</AppleLogin>
    </div>

  </form>
</template>

<script>
import {mapMutations, mapState} from 'vuex';
import GoogleLogin from '@/components/auth/GoogleLogin.vue';
import AppleLogin from '@/components/auth/AppleLogin.vue';
import {firebaseLog} from "@/plugins/firebase";

export default {
  title: 'Login',
  name: 'Login',
  components: {
    AppleLogin,
    GoogleLogin,
  },
  data() {
    return {
      error: '',
      successMessage: '',
      passwordType: 'password'
    };
  },
  computed: {
    ...mapState('authState', ['email', 'password', 'passwordError', 'emailError']),
  },
  methods: {
    ...mapMutations('authState', ['mutateEmail', 'mutatePassword', 'mutateEmailError', 'mutatePasswordError']),
    openPrompt() {
      let email = prompt(this.$t('auth.emailLabel'), this.email).trim();

      if (email) {
        this.$store.dispatch('userState/actionUserRestorePassword', {email: email}).then(() => {
          this.successMessage = this.$t('auth.emailSent') + ' <b>' + email + '</b>';
        }).catch(err => {
          this.setError(err);
        });
      }
    },
    setError: function (err) {
      this.error = err
    },
    submit: function () {

      this.error = '';

      if (!this.email) {
        this.mutateEmailError(this.$t('auth.emailIncorrect'))
      }

      if (!this.password) {
        this.mutatePasswordError(this.$t('auth.passwordRequired'))
      }

      if (this.emailError || this.passwordError) return;

      this.$store.dispatch('authState/actionLogin', {
        email: this.email.toLowerCase(),
        password: this.password,
        locale: this.$store.getters.locale || 'en',
        platform: 'web',
      }).then(() => {
        firebaseLog('web_user_logged_in', true)

        window.location.reload();

      }).catch(err => {
        this.setError(this.$t(`auth.${err.message}`));
      })
    }
  },
  beforeDestroy() {
    this.mutateEmailError('')
    this.mutatePasswordError('')
  }
};
</script>

<style lang='scss' scoped>

.c-auth-login {
  max-width: 400px;
  margin: 0 auto;

  & .password-after {
    width: 32px;
    height: 24px;
    cursor: pointer;
    display: flex;
  }

  & .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    & .register {
      min-height: 40px;
      display: flex;
      align-items: center;
    }
  }

  .forgot {
    width: 100%;
    text-align: right;
    margin-bottom: 10px;
    margin-top: 10px;
    font-size: $base-font;
  }

  & .social-buttons {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  & .error {
    margin-top: 10px;
    text-align: center;
    color: #B20603
  }

}


</style>
