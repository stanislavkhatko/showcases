<template>

  <div class="p-photo-tagsets">

    <el-popup class="delete-popup" size="medium" v-if="inDeleteTagset" @close="inDeleteTagset = null">
      <template v-slot:top>
        {{ $t('workspace.tagsetsDeleteTitle') }}
      </template>
      <template v-slot:content>
        <div class="content">
          <div class="left">
            <div class="top">
              <el-info-box
                  :image="require('@/assets/info_picture.svg') ">
                <div class="title">
                  {{ $t('workspace.tagsetsDeleteSetTitle') }}
                </div>
                <div class="tip">{{ $t('workspace.tagsetsDeleteSetHint1') }}</div>
                <div class="tip">{{ $t('workspace.tagsetsDeleteSetHint2') }}</div>
                <div class="tip">{{ $t('workspace.tagsetsDeleteSetHint3') }}</div>
              </el-info-box>
            </div>
            <div class="bottom">
              <el-button style="margin: 0 auto"
                         @click="$store.dispatch('tagsState/actionDeleteTagSet', inDeleteTagset).then(() => inDeleteTagset = null)">
                {{ $t('workspace.tagsetsDeleteSetButton') }}
              </el-button>
            </div>
          </div>
          <div class="right">
            <div class="top">
              <el-info-box
                  :image="require('@/assets/delete_tagset_warning.svg')">
                <div class="title">
                  {{ $t('workspace.tagsetsDeleteWithTagsTitle') }}
                </div>
                <div class="tip">{{ $t('workspace.tagsetsDeleteWithTagsHint1') }}</div>
                <div class="tip">{{ $t('workspace.tagsetsDeleteWithTagsHint2') }}</div>
                <div class="tip">{{ $t('workspace.tagsetsDeleteWithTagsHint3') }}</div>
              </el-info-box>
            </div>
            <div class="bottom">
              <el-button style="margin: 0 auto"
                         @click="deleteTagSetWithTags">
                {{ $t('workspace.tagsetsDeleteWithTagsButton') }}
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </el-popup>

    <div class="top">
      <el-button v-if="$route.name !== 'PhotoTags'" type="secondary"
                 @click="$router.push({name: 'PhotoTags'}).catch(() => {})"
                 style="margin-top: 20px;" icon="tag">{{ $t('workspace.fields') }}
      </el-button>

      <el-button icon="repeate-one" type="secondary"
                 v-if="$route.name !== 'PhotoTagBlocks'"
                 @click="$router.push({name: 'PhotoTagBlocks'}).catch(() => {})"
                 style="margin-top: 20px; margin-left: 10px;">
        {{ $t('workspace.blocks') }}
      </el-button>
    </div>


    <el-info-box style="margin-top: 20px;" :image="require('@/assets/info_picture.svg')">
      <h3>{{ $t('workspace.tagSets') }}</h3>
      <p v-html="$t('workspace.tagSetsHint1')"></p>
      <p v-html="$t('workspace.tagSetsHint2')"></p>
      <p v-html="$t('workspace.tagSetsHint3')"></p>

      <!--      <el-button style="margin-top: 10px;" type="secondary" size="small" icon="add" @click="$store.commit('tagsState/mutateEditedTagSet', {})">{{ $t('workspace.addTagSet') }}-->
      <el-button style="margin-top: 10px;" icon="add"
                 @click="onClickAddTagSet">{{ $t('workspace.addTagSet') }}
      </el-button>
    </el-info-box>

    <el-table style="display: flex; margin-top: 20px;" v-if="tagSets && tagSets.length" :columns="tagSetsColumns"
              :fixed-header="true"
              :table-data="tagSets"/>

  </div>

</template>

<script lang="jsx">
import {mapState} from "vuex";
import {i18n} from "@/plugins/i18n";

export default {
  title: i18n.t('pages.tagSets'),
  name: "PhotoTags",
  computed: {
    ...mapState('tagsState', ['tags', 'tagBlocks', 'tagSets']),
  },
  data() {
    return {
      inDeleteTagset: null,
      tagSetsColumns: [
        {
          field: "",
          key: "index",
          title: "",
          width: 40,
          align: "left",
          renderBodyCell: ({rowIndex}) => {
            return ++rowIndex;
          },
        },
        {
          field: "name",
          key: "name",
          title: this.$t('workspace.tagSetsName'),
          align: "left",
          width: '150px',
          fixed: 'left',

          renderBodyCell: ({row}) => {
            return (<b v-tooltip={{
              delay: {show: 500, hide: 100},
              content: row.name && row.name.length > 50 && row.name
            }} style="cursor: pointer"
                       on-click={() => (this.$store.getters['workspacesState/getActiveWorkspaceUserLicenseValid'] || row.default) ? this.$router.push({
                         name: 'TagSetPhoto',
                         params: {id: row.objectId}
                       }).catch(() => {
                       }) : this.$store.commit('mutateShowGoProPopup', true)}>{row.name && row.name.length > 50 ? row.name.substring(0, 50).concat('...') : row.name}</b>);
          },
        },
        {
          field: "tags", key: "tags",
          width: '300px',
          title: this.$t('workspace.tagSetsTags'), align: "left",
          renderBodyCell: ({row}) => {
            let tooltip = '';
            let viewResult = '';

            let tags = row.tags && row.tags.filter(t => this.tags && this.tags.find(tag => tag.objectId === t && tag.relation && tag.relation === 'PhotoProof'))
            let tagsLength = tags && tags.length;

            if (tagsLength) {
              if (tagsLength) row.tags.map((tagId, index) => {
                if (tagId.startsWith('tag_block_')) {
                  let tag = this.tags && this.tags.find(tag => tag.objectId === tagId)
                  if (tag) tooltip += tag.name + (tagsLength - 1 !== index ? ', ' : '');
                }
              })

              if (tagsLength && tagsLength > 2) {
                row.tags.map((tagId, index) => {
                  if (index < 2) {
                    if (!tagId.startsWith('tag_block_')) {
                      let tag = this.tags && this.tags.find(tag => tag.objectId === tagId)
                      if (tag) viewResult += tag.name + ', ';
                    }
                  }
                })

                viewResult += this.$tc('workspace.andCounterMore', tagsLength - 2, {n: tagsLength - 2})
              } else {
                if (tagsLength) viewResult = tooltip
              }
            }

            return (<span v-tooltip={{delay: {show: 500, hide: 100}, content: tooltip}}
                          domPropsInnerHTML={viewResult}></span>)
          },
        },
        {
          field: "projectTags", key: "projectTags",
          width: '300px',
          title: this.$t('workspace.tagSetsProjectTags'), align: "left",
          renderBodyCell: ({row}) => {
            let tooltip = '';
            let viewResult = '';

            let projectTags = row.tags && row.tags.filter(t => this.tags && this.tags.find(tag => tag.objectId === t && tag.relation && tag.relation === 'Project'))
            let tagsLength = projectTags && projectTags.length;

            if (tagsLength) {
              if (tagsLength) projectTags.map((tagId, index) => {
                let tag = this.tags && this.tags.find(tag => tag.objectId === tagId)
                if (tag) tooltip += tag.name + (tagsLength - 1 !== index ? ', ' : '');
              })

              if (tagsLength && tagsLength > 2) {
                projectTags.map((tagId, index) => {
                  if (index < 2) {
                    let tag = this.tags && this.tags.find(tag => tag.objectId === tagId)
                    if (tag) viewResult += tag.name + ', ';
                  }
                })

                viewResult += this.$tc('workspace.andCounterMore', tagsLength - 2, {n: tagsLength - 2})
              } else {
                if (tagsLength) viewResult = tooltip
              }
            }

            return (<span v-tooltip={{delay: {show: 500, hide: 100}, content: tooltip}}
                          domPropsInnerHTML={viewResult}></span>)
          },
        },
        {
          field: "buttons", key: "buttons", align: "left",
          renderBodyCell: ({row}) => {
            return (<span style="display: flex;">
              <el-icon name="edit" v-tooltip={{delay: {show: 500, hide: 100}, content: this.$t('buttons.edit')}}
                       style="cursor: pointer; margin-right: 10px; width: 24px; height: 24px"
                       on-click={() => this.onEditTagSet(row)}/>
              <el-remove on-click={() => this.openRemoveTagSetConfirmation(row)}/>
            </span>)
          }
        },
      ],
    }
  },
  beforeMount() {
    this.$store.dispatch('tagsState/actionGetTagSetsPhoto')
        .then(() => {
          this.tagSetsColumns.splice(3, 0, {
            field: 'blocks', key: 'blocks',
            width: '300px',
            title: this.$t('workspace.tagSetsBlocks'),
            align: "left",
            renderBodyCell: ({row}) => {

              let tooltip = '';
              let viewResult = '';

              let blockIds = row.tags && row.tags.filter(t => t.startsWith('tag_block_')).map(t => t.replace('tag_block_', ''))
              let blocks = this.tagBlocks && this.tagBlocks.filter(b => blockIds && blockIds.includes(b.objectId)).sort((a, b) => blockIds.indexOf(a.objectId) - blockIds.indexOf(b.objectId))

              let blocksLength = blocks && blocks.length;

              if (blocksLength) {
                if (blocksLength > 2) {

                  blocks.map((block, index) => {
                    tooltip += `${block.name}${blockIds.length - 1 !== index ? ', ' : ''}`

                    if (index < 2) viewResult += block.name + ', ';
                  })

                  viewResult += this.$tc('workspace.andCounterMore', blocksLength - 2, {n: blocksLength - 2})

                } else {
                  blocks.map((block, index) => {
                    viewResult += `${block.name}${blockIds.length - 1 !== index ? ', ' : ''}`
                  })
                }
              }

              return (<span v-tooltip={{delay: {show: 500, hide: 100}, content: tooltip}}
                            domPropsInnerHTML={viewResult}></span>)
            },
          },)
        })
  },
  beforeDestroy() {
    this.$store.commit('tagsState/mutateClearTagSetsState')
  },
  methods: {
    deleteTagSetWithTags() {
      let tagsCount = this.inDeleteTagset && this.inDeleteTagset.tags && this.inDeleteTagset.tags.filter(t => !t.startsWith('tag_block')).length

      this.$swal.fire({
        title: this.$t('workspace.sureDeleteTagSetWithFields'),
        text: this.$tc('workspace.sureDeleteTagSetWithFieldsText', tagsCount, {n: tagsCount}),
        showCancelButton: true,
        cancelButtonText: this.$t('buttons.cancel'),
        confirmButtonText: this.$t('buttons.delete'),
        icon: 'warning',
      }).then((result) => {
        if (result.isConfirmed) this.$store.dispatch('tagsState/actionDeleteTagSetWithTags', this.inDeleteTagset).then(() => this.inDeleteTagset = null)
      })
    },
    onEditTagSet(tagset) {
      if (this.$store.getters["workspacesState/getActiveWorkspaceUserLicenseValid"] || tagset.default) this.$router.push({
        name: 'TagSetPhoto',
        params: {id: tagset.objectId}
      }).catch(() => {
      })
      else this.$store.commit('mutateShowGoProPopup', true)
    },
    onClickAddTagSet() {
      if (this.$store.getters["workspacesState/getActiveWorkspaceUserLicenseValid"]) this.$router.push({
        name: 'TagSetPhoto',
        params: {id: 'new'}
      })
      else this.$store.commit('mutateShowGoProPopup', true)
    },
    openRemoveTagSetConfirmation(set) {
      this.inDeleteTagset = set;
    },
  }
}
</script>

<style lang="scss" scoped>

.p-photo-tagsets {

  & .top {
    display: flex;
    justify-content: flex-end;
  }

  & .delete-popup {

    & .content {
      display: flex;
      flex-wrap: wrap;

      & .top {
        flex: 1;
      }

      & .bottom {
        margin-bottom: 20px;
      }

      & .title {
        min-width: 200px;
        margin: 20px 0;
        font-weight: 500;
        text-align: center;
      }

      & .tip {
        margin-top: 10px;
        min-width: 200px;
        list-style: disc inside;
        display: list-item;
      }

      & .left {
        margin: 0 5px;
        flex: 1;
        display: flex;
        flex-direction: column;
        border: 2px solid #E6E6E6;
        border-radius: 15px;
      }

      & .right {
        margin: 0 5px;
        flex: 1;
        display: flex;
        flex-direction: column;
        border: 2px solid #E6E6E6;
        border-radius: 15px;
      }
    }
  }
}

</style>
