<template>

  <form class="c-auth-register" autocomplete="off" @submit.prevent="submit">

    <el-input :value="email"
              :data-lpignore="false"
              name="email"
              :placeholder="$t('auth.emailLabel')"
              type="email"
              @input="mutateEmail"
              :error.sync="$store.state.authState.emailError"
              :label="$t('auth.enterEmail')"/>

    <el-input :value="password"
              :data-lpignore="false"
              name="password"
              :placeholder="$t('auth.passwordLabel')"
              :type="passwordType"
              @input="mutatePassword"
              :error.sync="$store.state.authState.passwordError"
              :label="$t('auth.enterPassword')">
      <template v-slot:after>
        <div class="password-after">
          <el-icon name="eye" v-if="passwordType === 'password'" @click="passwordType = 'input'"/>
          <el-icon name="eye-slash" v-if="passwordType === 'input'" @click="passwordType = 'password'"/>
        </div>
      </template>
    </el-input>

    <div class="inputs">
      <el-input :value="name"
                name="name"
                :placeholder="$t('auth.name')"
                @input="mutateName"
                :label="$t('auth.enterName')"/>

      <el-input :value="companyName"
                name="companyName"
                :placeholder="$t('auth.companyName')"
                @input="mutateCompanyName"
                :label="$t('auth.enterCompanyName')"/>
    </div>

    <el-checkbox type="native" inline="yes" :checked="subscribe" :label="$t('auth.subscribeNewsletters')"
                 @change="mutateSubscribe"/>

    <div class="status">
      <div class="error" v-if="error">{{ error }}</div>
    </div>

    <div class="buttons">
      <router-link :to="{name: 'Login'}" class="router-link-inherit">{{ $t('auth.login') }}</router-link>
      <el-button button-type="submit" style="margin-left: 20px">{{ $t('auth.register') }}</el-button>
    </div>

    <div class="social-buttons">
      <GoogleLogin @err="setError"/>
    </div>


  </form>

</template>

<script>
import {mapMutations, mapState} from "vuex";
import GoogleLogin from "@/components/auth/GoogleLogin.vue";
import {firebaseLog} from "@/plugins/firebase";

export default {
  name: "Register",
  components: {
    GoogleLogin
  },
  data() {
    return {
      error: '',
      passwordType: 'password',
    }
  },
  computed: {
    ...mapState('authState', ['email', 'password', 'companyName', 'name', 'subscribe', 'emailError', 'passwordError'])
  },
  methods: {
    ...mapMutations('authState', ['mutateEmail', 'mutatePassword', 'mutateEmailError', 'mutatePasswordError', 'mutateCompanyName', 'mutateSubscribe', 'mutateName']),
    setError(error) {
      this.error = error
    },
    submit() {
      if (!this.email) this.mutateEmailError(this.$t('auth.enterEmail'))
      if (!this.password) this.mutatePasswordError(this.$t('auth.passwordRequired'))

      if (this.emailError || this.passwordError) return;

      this.$store.dispatch('authState/actionRegister', {
        email: this.email,
        password: this.password,
        name: this.name,
        companyName: this.companyName,
        locale: this.$store.getters.locale || 'en',
        platform: 'web',
        subscribe: this.subscribe
      }).then(() => {
        firebaseLog('web_user_registered', true)
        firebaseLog('web_user_logged_in', true)

        window.location.reload();
      })
          .catch(error => {
            this.error = this.$t(`auth.${error.message}`);
          });
    }
  },
  beforeDestroy() {
    this.mutateEmailError('')
    this.mutatePasswordError('')
    this.error = '';
  }
}
</script>

<style lang="scss" scoped>

.c-auth-register {
  max-width: 400px;
  margin: 0 auto;

  & .password-after {
    width: 32px;
    height: 24px;
    cursor: pointer;
    display: flex;
  }

  & .buttons {
    margin-top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  & .inputs {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -5px;

    & .el-input {
      overflow: hidden;
      flex: 1;
      min-width: 190px;
      padding: 0 5px;
    }

  }

  & .status {
    position: relative;
  }

  & .error {
    left: 0;
    right: 0;
    position: absolute;
    margin-top: 10px;
    text-align: center;
    font-weight: 500;
    font-size: $base-font;
    color: $red;
  }

  & .social-buttons {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }

}
</style>
