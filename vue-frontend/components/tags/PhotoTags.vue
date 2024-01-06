<template>

  <div class="p-photo-tags">

    <div class="top">
      <el-back class="back" style="margin-right: 10px;" :to="{name: 'TagSetsPhoto'}">{{
          $t('workspace.tagSets')
        }}
      </el-back>

      <el-select style="min-width: 200px; margin-top: 0;" @input="setSelectedRelation"
                 :value="options.find(i => i.value === selectedRelation)"
                 :reduce="item => item.value" :name="i => i.name" :options="options"/>

    </div>

    <el-info-box v-if="selectedRelation === 'PhotoProof'" style="margin-top: 50px;"
                 :image="require('@/assets/photo_proof_tags.svg')">
      <h3>{{ $t('workspace.photoProofTags') }}</h3>

      <div>{{ $t('workspace.tagsHint1') }}</div>
      <div>{{ $t('workspace.tagsHint2') }}</div>

      <el-button style="margin-top: 10px;" icon="add"
                 @click="onClickAddNewTag">
        {{ $t('workspace.addTag') }}
      </el-button>
    </el-info-box>

    <el-info-box v-if="selectedRelation === 'Project'" style="margin-top: 20px;"
                 :image="require('@/assets/info_picture.svg')">
      <h3>{{ $t('workspace.projectTags') }}</h3>
      <p v-html="$t('workspace.projectTagsHint1')"></p>
      <!--      <p v-html="$t('workspace.tagSetsHint2')"></p>-->
      <!--      <p v-html="$t('workspace.tagSetsHint3')"></p>-->

      <el-button style="margin-top: 20px;" icon="add"
                 @click="onClickAddNewTag">
        {{ $t('workspace.addTag') }}
      </el-button>
    </el-info-box>

    <el-info-box v-if="selectedRelation === 'Form'" style="margin-top: 20px;"
                 :image="require('@/assets/info_picture.svg')">
      <h3>{{ $t('workspace.formTags') }}</h3>
      <p v-html="$t('workspace.formTagsHint1')"></p>
      <!--      <p v-html="$t('workspace.tagSetsHint2')"></p>-->
      <!--      <p v-html="$t('workspace.tagSetsHint3')"></p>-->

      <el-button style="margin-top: 20px;" icon="add"
                 @click="onClickAddNewTag">
        {{ $t('workspace.addTag') }}
      </el-button>
    </el-info-box>

    <p style="margin: 30px 0">{{
        $tc('workspace.outOf', null, {
          b: filteredTags && filteredTags.length,
          a: computedTags && computedTags.length
        })
      }}</p>

    <el-table
        :style="`max-width: 1200px; width: ${$store.state.windowWidth - (48 + 60)}px; margin-top: 30px;`"
        :columns="tagsColumns"
        :table-data="computedTags"/>

  </div>

</template>

<script lang="jsx">

import {mapState} from "vuex";
import dateHelpers from "@/mixins/dateHelpers";
import {i18n} from "@/plugins/i18n";


export default {
  name: "PhotoTags",
  title: i18n.t('pages.tags'),
  mixins: [dateHelpers],
  computed: {
    ...mapState('tagsState', ['tags', 'tagBlocks', 'tagSets']),
    computedTags() {
      let searchTags = []
      this.filteredTags && this.filteredTags.map(tag => {
        if (this.searchData.types && this.searchData.types.length && this.searchData.types.includes(tag.type)) searchTags.push(tag)
        if (this.searchData.name && tag.name.toLowerCase().includes(this.searchData.name)) searchTags.push(tag)

        if ((!this.searchData.types || !this.searchData.types.length) && !this.searchData.name) searchTags.push(tag)
      })

      return searchTags
    },
    filteredTags() {
      return this.tags && this.tags.filter(tag => tag.relation === this.selectedRelation)
    },
  },
  data() {
    return {
      selectedRelation: 'PhotoProof',
      options: [
        {value: 'PhotoProof', label: this.$t('workspace.photoProofTags')},
        {value: 'Project', label: this.$t('workspace.projectTags')},
      ],
      searchData: {
        types: [],
        name: "",
      },
      tagsColumns: [
        {
          field: "",
          key: "index",
          title: "",
          width: 40,
          fixed: 'left',
          align: "left",
          renderBodyCell: ({rowIndex}) => {
            return ++rowIndex;
          },
        },
        {
          field: "name",
          key: "name",
          title: this.$t('workspace.tagName'),
          align: "left",
          width: '200px',
          renderBodyCell: ({row}) => {
            return (<b v-tooltip={row.name && row.name.length > 50 && row.name} style="cursor: pointer"
                       on-click={() => this.$store.commit('tagsState/mutateEditedTag', row)}>{row.name && row.name.length > 50 ? row.name.substring(0, 50).concat('...') : row.name}</b>);

          },
          filterCustom: {
            defaultVisible: false,
            render: ({showFn, closeFn}, h) => {
              return (
                  <div style="padding: 5px;">
                    <el-search style="margin: 0"
                               value={this.searchData.name}
                               on-search={e => this.searchData.name = e && e.toLowerCase()}
                               placeholder={this.$t('workspace.filterTags')}
                    />
                    <div style="display: flex; justify-content: space-between;">
                      <el-button type="link"
                                 on-click={() => this.searchCancel(closeFn)}>{this.$t('buttons.cancel')}</el-button>
                      <el-button type="link"
                                 on-click={() => this.searchConfirm(closeFn)}>{this.$t('buttons.confirm')}</el-button>
                    </div>
                  </div>
              );
            },
          },
        },
        {
          field: "relation",
          width: '300px',
          key: "relation", title: this.$t('workspace.tagRelation'), align: "left",
          renderBodyCell: ({row}) => {
            return (<span>{this.$t(`workspace.tagRelations.${row.relation.toLowerCase()}`)}</span>)
          },
        },
        {
          field: "used",
          width: '200px',
          key: "used", title: this.$t('workspace.usedInTagSet'),
          align: "left",
          renderBodyCell: ({row}) => {
            let tagsets = this.tagSets.filter(tagset => tagset.tags && tagset.tags.includes(row.objectId))
            let tagsetsString = '';

            tagsets.map((tagset, index) => {
              tagsetsString += tagset.name + (tagsets.length - 1 !== index ? ', ' : '');
            })

            return (<span v-tooltip={{
              delay: {show: 500, hide: 100},
              content: tagsetsString && tagsetsString.length > 50 && tagsetsString
            }}>{this.$options.filters.crop(tagsetsString, 50)}</span>);
          },
        },
        {
          field: "usedCounter",
          width: '100px',
          key: "usedCounter", title: `Usage count`, // TODO TODO add translation
          align: "left",
          renderBodyCell: ({row}) => {
            return (<span>{row.usageCount}</span>);
          },
          filterCustom: {
            defaultVisible: false,
            render: ({showFn, closeFn}, h) => {
              return (
                  <div style="padding: 5px 10px;">
                    <el-button size="small" type="link"
                        on-click={e => this.runRefreshUsage()}
                    >{this.$t('buttons.update')}</el-button>
                  </div>
              );
            },
          },

        },
        {
          field: "buttons", key: "buttons", align: "right", width: '200px',
          renderBodyCell: ({row}) => {
            return (<span style="display: flex;">
              <el-icon name="edit" v-tooltip={{delay: {show: 500, hide: 100}, content: this.$t('buttons.edit')}}
                       style="cursor: pointer; width: 24px; height: 24px;"
                       on-click={() => this.$store.commit('tagsState/mutateEditedTag', row)}/>

              <el-remove style="margin-left: 10px" on-click={() => this.openTagRemoveConfirmation(row)}/>
            </span>)
          }

        },
      ],
    }
  },
  beforeMount() {
    this.$store.dispatch('tagsState/actionGetTagSetsPhoto').then(() => {
      if (this.$store.getters['workspacesState/getActiveWorkspaceDefaultTagValuesEnabled']) {
        let types = [];
        this.tags && this.tags.map(t => types.includes(t.type) || types.push(t.type))

        this.tagsColumns.splice(2, 0,
            {
              field: "type",
              width: '300px',
              key: "type", title: this.$t('workspace.tagKind'), align: "left",
              renderBodyCell: ({row}) => {
                return (<span>{this.$t(`fieldType.${row.type}`)}</span>)
              },
              filter: {
                filterList: types.map(t => {
                  return {value: t, label: this.$t(`fieldType.${t}`), selected: false}
                }),
                isMultiple: true,
                filterConfirm: (filterList) => {
                  this.searchData.types = filterList
                      .filter((x) => x.selected)
                      .map((x) => x.value);
                },
                filterReset: (filterList) => {
                  this.searchData.types = [];
                },
              },
            },
        )
        this.tagsColumns.splice(4, 0, {
          field: "value",
          key: "value",
          title: this.$t('workspace.defaultValue'),
          align: "left",
          width: '150px',
          renderBodyCell: ({row}) => {
            let type = row.type;
            let language = this.$store.getters['workspacesState/getActiveWorkspaceLanguage']

            if (row.defaultValue || row.defaultFile) switch (type) {
              case 'select':
              case 'multiselect':
                let value;

                try {
                  value = JSON.parse(row.defaultValue)
                  value = value.length ? value.map(item => item[language] || item['en'] || item) : value

                } catch (e) {
                  return row.defaultValue
                }

                return value;

              case 'checkbox':
                return (row.defaultValue && (row.defaultValue === false ? this.$t('buttons.no') : this.$t('buttons.yes')))

              case 'date':
                return this.dateHelperFormatDate(new Date(+row.defaultValue), 'dd.MM.yyyy')

              case 'image':
                if (row.defaultFileThumbnail360) return (
                    <img style="height: 30px;" src={row.defaultFileThumbnail360.url}/>)
                else return '';

              default:
                return (row.defaultValue);
            }
          },
        },)
      }
    })
  },
  beforeDestroy() {
    this.$store.commit('tagsState/mutateClearTagSetsState')
  },
  methods: {
    runRefreshUsage() {
      this.$store.dispatch('tagsState/actionRefreshTagsUsage')
    },
    searchCancel(closeFn) {
      closeFn();
    },
    searchConfirm(closeFn, value) {
      closeFn();
    },
    setSelectedRelation($event) {
      this.selectedRelation = $event
      this.searchData = {
        types: [],
        name: ''
      }
    },
    onClickAddNewTag() {
      if (this.$store.getters["workspacesState/getActiveWorkspaceUserLicenseValid"]) this.$store.commit('tagsState/mutateEditedTag', {relation: this.selectedRelation})
      else this.$store.commit('mutateShowGoProPopup', true)
    },
    openTagRemoveConfirmation(tag) {
      this.$store.dispatch('tagsState/actionGetTagUsage', tag).then(res => {

        this.$swal.fire({
          title: this.$t('notification.sure'),
          text: this.$tc('workspace.deleteTagCountPrompt', res.data.count, {n: res.data.count}),
          showCancelButton: true,
          cancelButtonText: this.$t('buttons.cancel'),
          confirmButtonText: this.$t('buttons.delete'),
          icon: 'warning',
        }).then((result) => {
          if (result.isConfirmed) this.$store.dispatch('tagsState/actionDeleteTag', tag);
        })
      })
    },
    openTagArchiveConfirmation(tag) {
      this.$swal.fire({
        title: this.$t('notification.sure'),
        text: tag.archived ? this.$t('workspace.unarchivedTagInfo') : this.$t('workspace.archivedTagInfo'),
        showCancelButton: true,
        cancelButtonText: this.$t('buttons.cancel'),
        confirmButtonText: tag.archived ? this.$t('buttons.unarchive') : this.$t('buttons.archive'),
        icon: 'warning',
      }).then((result) => {
        if (result.isConfirmed) this.$store.dispatch('tagsState/actionArchiveWorkspaceTag', tag);
      })
    },
  }
}

</script>

<style lang="scss" scoped>

.p-photo-tags {

  & .top {
    margin-top: 20px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

}

</style>
