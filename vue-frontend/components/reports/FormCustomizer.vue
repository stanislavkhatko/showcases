<template>

  <el-popup class="c-form-customizer" v-if="editedForm" @close="closePopup">
    <template v-slot:top>
        {{ $t('reports.customizeReport') }}
    </template>

    <template v-slot:content>
      <div class="content">
        <div class="left">
          <el-upload style="margin-top: 0;" @mouseenter="logoActive = true" @mouseleave="logoActive = false"
                     @input="setLogoData" prefix="data:image;base64," accept=".png, .jpg, .jpeg"
                     :value="editedForm.logo && (editedForm.logo.data || editedForm.logo.url)"
                     :label="$t('reports.formLogo')"
                     :error.sync="editedFormErrors.logo"/>

          <el-input @focus="companyActive = true" @blur="companyActive = false" :label="$t('reports.companyName')"
                    v-model="editedForm.companyName"/>

          <el-textarea @focus="infoActive = true" @blur="infoActive = false" :min-height="100" v-model="editedForm.info"
                       :label="$t('reports.info')"/>

          <el-textarea @focus="disclaimerActive = true" @blur="disclaimerActive = false" :min-height="100"
                       v-model="editedForm.disclaimer" :label="$t('reports.disclaimer')"/>

        </div>
        <div class="right">

          <div class="image">
            <img draggable="false" :src="require('@/assets/report_template.jpg')" alt="report template">

            <div class="logo" :class="{active: logoActive}"></div>
            <div class="company" :class="{active: companyActive}"></div>
            <div class="info" :class="{active: infoActive}"></div>
            <div class="disclaimer" :class="{active: disclaimerActive}"></div>

          </div>
        </div>
      </div>
    </template>
    <template v-slot:bottom>
        <el-button icon="tick-square" size="large" @click="submit">{{ $t('buttons.save') }}</el-button>
    </template>
  </el-popup>

</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "FormCustomizer",
  data() {
    return {
      logoActive: false,
      infoActive: false,
      companyActive: false,
      disclaimerActive: false,
    }
  },
  computed: {
    ...mapState('reportsState', ['editedForm', 'editedFormErrors'])
  },
  methods: {
    ...mapMutations('reportsState', ['mutateEditedFormErrors', 'mutateEditedFormProperty']),
    closePopup() {
      this.$store.commit('reportsState/mutateEditedForm', null)
    },
    submit() {

      for (let value of Object.values(this.editedFormErrors)) {
        if (value) return;
      }

      this.$store.dispatch('reportsState/actionUpdateEditedForm')
    },
    setLogoData(e) {
      this.logoActive = false;

      if (e) {
        this.mutateEditedFormProperty({logo: e})
      } else {
        this.mutateEditedFormProperty({logo: null})
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.c-form-customizer {

  & .content {
    display: flex;
    padding: 15px;
    margin: 0 -15px;
    flex-wrap: wrap;
    height: 100%;
    justify-content: center;

    & .left {
      flex: 1;
    }

    & .right {
      margin-left: 20px;
      flex: 1;

      & .image {
        position: relative;
        border: 2px $light-green dashed;

        & div {
          border: 3px solid transparent;
          position: absolute;
          border-radius: 10px;
          transition: border 0.3s linear;

          &.active {
            border: 3px solid $pastel-orange;
          }
        }
      }

      & img {
        width: 100%;
      }

      & .logo {
        width: 28%;
        height: 6%;
        right: 5%;
        top: 3%;
      }

      & .company {
        top: 83%;
        right: 4%;
        width: 15%;
        height: 3%;
      }

      & .info {
        top: 86%;
        right: 4%;
        width: 18%;
        height: 6%;
      }

      & .disclaimer {
        top: 93%;
        left: 25%;
        width: 48%;
        height: 4%;
      }
    }
  }

}

</style>
