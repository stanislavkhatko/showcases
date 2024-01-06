<template>

  <el-popup class="c-tag-form" size="medium" :zIndex="40" v-if="editedTag" @close="closePopup">
    <template v-slot:top>
      {{ editedTag.objectId ? $t('workspace.editTag') : $t('workspace.addTag') }}
    </template>

    <template v-slot:content>
      <div class="content">
        <div class="left">

          <el-input style="margin-top: 0;" :label="$t('workspace.tagName')" :maxLength="300"
                    v-model="editedTag.name" :error.sync="editedTagErrors.name"/>
          <el-textarea :label="$t('workspace.tagDescription')" :maxLength="500"
                       v-model="editedTag.desc" :error.sync="editedTagErrors.desc"/>

          <div class="row" v-if="editedTag.relation">
            <el-select v-model="editedTag.type" :error.sync="editedTagErrors.type"
                       :label="$t('workspace.tagKind')"
                       :reduce="item => item.value" :options="typeOptions" :disabled="editedTag.objectId"/>
          </div>

          <div class="tag-options-list" v-if="['select', 'multiselect'].includes(editedTag.type)">
            <el-input :error.sync="editedTagErrors.options" @enter="onTagOptionsInput"
                      :label="$t('workspace.dropdownOptions')" v-model="input" max-length="80">
              <template v-slot:after>
                <div class="list-input-after">
                  <el-icon name="arrow-right" @click="onTagOptionsInput"/>
                </div>
              </template>
            </el-input>

            <draggable class="list" @input="onTagOptionsOrder" :value="editedTag.options" handle=".handle"
                       :disabled="false" :animation="100">
              <div class="option" v-for="(option, index) in editedTag.options" :key="index">
                <div class="handle">
                  <el-icon name="arrow-2"
                           v-tooltip="{delay: { show: 500, hide: 100 }, content: $t('workspace.dragToChangeOrder')}"/>
                </div>
                <div class="name" style="width: 100%">
                  <el-input style="margin-top: 0;" size="small" max-length="80"
                            :value="option.key ? option['en'] : option"
                            @input="onTagOptionsSetValue($event, option, index)"/>
                </div>
                <div class="actions">
                  <el-icon style="color: red;" @click="onTagOptionsDelete(index)" name="close-square"
                           v-tooltip="$t('buttons.delete')"/>
                </div>
              </div>
            </draggable>
          </div>

          <div class="tag-default-value"
               v-if="editedTag.relation === 'PhotoProof' && $store.getters['workspacesState/getActiveWorkspaceDefaultTagValuesEnabled']">
            <h3>{{ $t('workspace.defaultValue') }}</h3>
            <p>{{ $t('workspace.defaultValueDescription') }}</p>

            <div>
              <!-- It's a Tag classs -->
              <el-input v-if="['licenseplate', 'laserliner', 'color'].includes(editedTag.type)"
                        :label="editedTag.name"
                        :value="editedTag.defaultValue"
                        @input="mutateEditedTagProperty({defaultValue: $event})"
              />

              <el-address v-if="editedTag.type === 'address'"
                          :label="editedTag.name"
                          :value="editedTag.defaultValue"
                          @input="mutateEditedTagProperty({defaultValue: $event})"
                          @onChanged="mutateEditedTagProperty({defaultValue: $event.formatted_address})"/>

              <el-textarea v-if="editedTag.type === 'input'"
                           :label="editedTag.name"
                           :value="editedTag.defaultValue"
                           @input="mutateEditedTagProperty({defaultValue: $event})"/>

              <el-input v-if="editedTag.type === 'barcode'"
                        :label="editedTag.name"
                        :value="editedTag.defaultValue"
                        @input="mutateEditedTagProperty({defaultValue: $event})"/>

              <el-select v-if="editedTag.type === 'select'" :clearable="true"
                         :label="editedTag.name" :options="editedTag.options"
                         :value="editedTag.defaultValue"
                         @input="mutateEditedTagProperty({defaultValue: modifySelectEvent($event)})">
                <template v-slot:option="option">
                  {{ option.key ? (option[$i18n.locale] || option.en) : option.label }}
                </template>

                <template v-slot:selected-option="option">
                  {{ option.key ? (option[$i18n.locale] || option.en) : option.label }}
                </template>
              </el-select>

              <el-select v-if="editedTag.type === 'multiselect'" :clearable="true"
                         :label="editedTag.name"
                         :multiple="true"
                         :options="editedTag.options"
                         :value="editedTag.defaultValue"
                         @input="mutateEditedTagProperty({defaultValue: modifySelectEvent($event, true)})">
                <template v-slot:option="option">
                  {{ option.key ? (option[$i18n.locale] || option.en) : option.label }}
                </template>

                <template v-slot:selected-option="option">
                  {{ option.key ? (option[$i18n.locale] || option.en) : option.label }}
                </template>
              </el-select>

              <el-switcher v-if="editedTag.type === 'checkbox'"
                           :label="editedTag.name"
                           :value="editedTag.defaultValue"
                           @change="mutateEditedTagProperty({defaultValue: $event})"/>

              <el-datetime v-if="editedTag.type === 'date'" :clearable="true"
                           :label="editedTag.name"
                           :value="editedTag.defaultValue ? +editedTag.defaultValue : null"
                           format="DD MMM YYYY"
                           type="date" valueType="timestamp"
                           @input="mutateEditedTagProperty({defaultValue: $event})"/>

              <el-datetime v-if="editedTag.type === 'time'" :clearable="true"
                           :label="editedTag.name"
                           :value="editedTag.defaultValue" format="HH:mm" type="time"
                           valueType="format"
                           @input="mutateEditedTagProperty({defaultValue: $event})"/>

              <el-upload v-if="editedTag.type === 'image'"
                         :label="editedTag.name"
                         :original="(editedTag.defaultValue && editedTag.defaultValue.data) || (editedTag.defaultFile && editedTag.defaultFile.url)"
                         :value="(editedTag.defaultValue && editedTag.defaultValue.data) || (editedTag.defaultFileThumbnail360 && editedTag.defaultFileThumbnail360.url) ||
                                       (editedTag.defaultFile && editedTag.defaultFile.url)"
                         accept=".png, .jpg, .jpeg, .heic" prefix="data:image;base64,"
                         @input="mutateEditedTagProperty($event ? {defaultValue: $event} : {defaultValue: $event, defaultFile: null, defaultFileThumbnail360: null})"/>
            </div>
          </div>

        </div>
        <div class="right">
          <div class="title">{{ $t('workspace.editTagPreview') }}</div>
          <div class="image">
            <template v-if="!editedTag.type">{{ $t('workspace.editTagPreviewHint') }}</template>
            <img draggable="false" v-if="editedTag.type === 'input'"
                 :src="require('@/assets/tag_input.svg')" alt="">
            <img draggable="false" v-if="editedTag.type === 'address'"
                 :src="require('@/assets/tag_address.svg')"
                 alt="">
            <img draggable="false" v-if="editedTag.type === 'select'"
                 :src="require('@/assets/tag_select.svg')" alt="">
            <img draggable="false" v-if="editedTag.type === 'multiselect'"
                 :src="require('@/assets/tag_multiselect.svg')" alt="">
            <img draggable="false" v-if="editedTag.type === 'licenseplate'"
                 :src="require('@/assets/tag_licenseplate.svg')" alt="">
            <img draggable="false" v-if="editedTag.type === 'color'"
                 :src="require('@/assets/tag_color.svg')" alt="">
            <img draggable="false" v-if="editedTag.type === 'laserliner'"
                 :src="require('@/assets/tag_laserliner.svg')"
                 alt="">
            <img draggable="false" v-if="editedTag.type === 'time' || editedTag.type === 'date'"
                 :src="require('@/assets/tag_time.svg')" alt="">
            <img draggable="false" v-if="editedTag.type === 'barcode'"
                 :src="require('@/assets/tag_barcode.svg')"
                 alt="">
            <img draggable="false" v-if="editedTag.type === 'checkbox'"
                 :src="require('@/assets/tag_checkbox.svg')"
                 alt="">
            <img draggable="false" v-if="editedTag.type === 'image'"
                 :src="require('@/assets/tag_image.png')" alt="">

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
import draggable from 'vuedraggable'


export default {
  name: "TagForm",
  components: {draggable},
  data() {
    return {
      input: '',
      relations: [
        {label: this.$t('workspace.photoProofTags'), value: 'PhotoProof'},
        {label: this.$t('workspace.projectTags'), value: 'Project'},
        {label: this.$t('workspace.formTags'), value: 'Form'}
      ],
      types: [
        {value: 'text', label: this.$t('workspace.input')},
        {value: 'selection', label: this.$t('workspace.select')},
        {value: 'multiselection', label: this.$t('workspace.multiselect')},
        {value: 'switcher', label: this.$t('workspace.checkbox')},
        {value: 'dateselection', label: this.$t('workspace.date')},
        {value: 'timeselection', label: this.$t('workspace.time')},
        {value: 'imageupload', label: this.$t('workspace.image')},
        {value: 'address', label: this.$t('workspace.address')},
        {value: 'laserliner', label: this.$t('workspace.laserliner')},
      ]
    }
  },
  computed: {
    typeOptions() {
      if (this.editedTag.relation === 'Form') return this.types.filter(type => !['image', 'licenseplate', 'laserliner', 'address', 'color', 'nfc'].includes(type.value))
      if (this.editedTag.relation === 'Project') return this.types.filter(type => !['licenseplate', 'laserliner', 'color', 'nfc'].includes(type.value))
      if (this.editedTag.relation === 'PhotoProof') return this.types.filter(type => ![].includes(type.value))

      return this.types
    },
    ...mapState('tagsState', ['tags', 'editedTag', 'editedTagErrors', 'editedTagBlock']),
    projectTags() {
      return this.tags && this.tags.filter(tag => tag.objectId && tag.relation === 'Project');
    },
    photoProofTags() {
      return this.tags && this.tags.filter(tag => tag.objectId && tag.relation === 'PhotoProof')
    },
  },
  methods: {
    modifySelectEvent(e, multiple = false) {
      if (!multiple) {
        return e ? JSON.stringify([e]) : ''
      } else {
        return e && e.length ? JSON.stringify(e) : ''
      }
    },
    ...mapMutations('tagsState', ['mutateEditedTagErrors', 'mutateEditedTagProperty']),
    closePopup() {
      this.$store.commit('tagsState/mutateEditedTag', null)
    },
    submit() {

      if (!this.editedTag.name) this.mutateEditedTagErrors({name: this.$t('workspace.required')})
      if (!this.editedTag.relation) this.mutateEditedTagErrors({relation: this.$t('workspace.required')})
      if (!this.editedTag.type) this.mutateEditedTagErrors({type: this.$t('workspace.required')})
      if (['select', 'multiselect'].includes(this.editedTag.type) && (!this.editedTag.options || !this.editedTag.options.length)) this.mutateEditedTagErrors({options: this.$t('workspace.createDropdownOptions')})

      for (let value of Object.values(this.editedTagErrors)) {
        if (value) return;
      }

      this.$store.dispatch('tagsState/actionUpdateEditedTag').then(tag => {

        this.$store.commit('tagsState/mutateTagsUpdateOrPush', tag)

        if (this.$route.name === 'PhotoTags') {

        } else if (this.editedTagBlock) {

          let block = this.editedTagBlock;
          block.tags = block.tags ? (block.tags.includes(tag.objectId) ? [...block.tags] : [...block.tags, tag.objectId]) : [tag.objectId]

          this.$store.commit('tagsState/mutateEditedTagBlock', block)
          this.$store.dispatch('tagsState/actionUpdateEditedTagBlock').then(tb => this.$store.commit('tagsState/mutateEditedTagBlock', tb))
        } else {

          let tagset = this.$store.state.tagsState.editedTagSet;
          tagset.tags = tagset.tags ? (tagset.tags.includes(tag.objectId) ? [...tagset.tags] : [...tagset.tags, tag.objectId]) : [tag.objectId]

          this.$store.commit('tagsState/mutateEditedTagSet', tagset)
          this.$store.dispatch('tagsState/actionUpdateEditedTagSet').then(ts => this.$router.push({
            name: 'TagSetPhoto',
            params: {id: ts.objectId}
          }).catch(() => {
          }))
        }
      })
    },
    onTagOptionsSetValue(value, option, index) {
      let values = this.editedTag.options;
      values[index].key ? values[index].key['en'] = value : values[index] = value;

      this.mutateEditedTagProperty({options: values})
    },
    onTagOptionsDelete(index) {
      let values = this.editedTag.options;
      values.splice(index, 1)

      this.mutateEditedTagProperty({options: values})
    },
    onTagOptionsInput() {
      if (this.input.trim()) {
        let values = this.editedTag.options ? [...this.editedTag.options, this.input] : [this.input];

        this.mutateEditedTagProperty({options: values})
        this.input = '';
      }
    },
    onTagOptionsOrder(values) {
      this.mutateEditedTagProperty({options: values})
    }
  }
}
</script>

<style lang="scss" scoped>

.c-tag-form {

  & .content {
    display: flex;
    padding: 15px;
    flex-wrap: wrap;
    height: 100%;
    justify-content: center;
    margin: 0 -15px;

    & .row {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -15px;

      & > div {
        flex: 1;
        padding: 0 15px;
      }
    }

    & .left {
      padding: 0 15px;
      flex: 1;
      min-width: 200px;

      .tag-options-list {

        & .list-input-after {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        & .list {
          margin-top: 10px;

          & .sortable-drag {
            opacity: 0;
          }

          & .sortable-chosen {
            font-weight: 500;
          }

          & .actions {
            margin-left: 10px;
            display: flex;
          }

          & .option {
            display: flex;
            margin-top: 5px;
            align-items: center;
          }

          & .handle {
            margin-right: 10px;
            display: flex;
            align-items: center;

            & svg {
              cursor: move;
            }
          }
        }
      }

      .tag-default-value {
        margin-top: 30px;
      }
    }

    & .right {
      padding: 0 15px;
      flex: 1;

      & .image {
        border-radius: 15px;
        padding: 15px;
        display: flex;
        border: 1px solid $light-green;
        align-items: center;
        min-height: 170px;

        & img {
          width: 100%;
        }
      }
    }
  }
}

</style>
