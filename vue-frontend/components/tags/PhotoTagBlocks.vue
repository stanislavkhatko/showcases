<template>

  <div class="p-photo-tag-blocks">

    <div class="top" style="margin-top: 30px;">
      <el-back class="back" :to="{name: 'TagSetsPhoto'}">{{ $t('workspace.tagSets') }}</el-back>
    </div>

    <el-info-box style="margin-top: 50px;">
      <h3>{{ $t('workspace.blocks') }}</h3>

      <div>{{ $t('workspace.blocksHint') }}</div>

      <el-button style="margin-top: 10px;" icon="add"
                 @click="onClickAddBlock">{{ $t('workspace.addTagBlock') }}
      </el-button>
    </el-info-box>


    <el-table style="display: flex; margin-top: 20px" v-if="tagBlocks && tagBlocks.length" :columns="blocksColumns"
              :fixed-header="true"
              :table-data="tagBlocks"/>

  </div>

</template>

<script lang="jsx">
import {mapState} from "vuex";
import {i18n} from "@/plugins/i18n";

export default {
  name: "PhotoTagBlocks",
  title: i18n.t('pages.tagBlocks'),
  computed: {
    ...mapState('tagsState', ['tags', 'tagBlocks', 'tagSets']),
  },
  data() {
    return {
      blocksColumns: [
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
          title: this.$t('workspace.blockName'),
          align: "left",
          width: '150px',
          fixed: 'left',
          renderBodyCell: ({row}) => {
            return (<b v-tooltip={{
              delay: {show: 500, hide: 100},
              content: row.name && row.name.length > 50 && row.name
            }} style="cursor: pointer"
                       on-click={() => this.onClickEditBlock(row)}>{row.name && row.name.length > 50 ? row.name.substring(0, 50).concat('...') : row.name}</b>);
          },
        },
        {
          field: "tags",
          width: '300px',
          key: "tags", title: this.$t('workspace.blockTags'), align: "left",
          renderBodyCell: ({row}) => {
            let result = '';
            if (row.tags) row.tags.map(tagId => {
              let tag = this.tags && this.tags.find(tag => tag.objectId === tagId)
              if (tag) result += tag.name + ', ';
              else result += tagId + ', ';
            })

            return (<span>{result}</span>)
          },
        },
        {
          field: "used",
          width: '200px',
          key: "used", title: this.$t('workspace.usedInTagSet'),
          align: "left",
          renderBodyCell: ({row}) => {
            let tagsets = this.tagSets.filter(tagset => tagset.tags && tagset.tags.includes(`tag_block_${row.objectId}`))
            let tagsetsString = '';

            tagsets.map((tagset, index) => {
              tagsetsString += tagset.name + (tagsets.length - 1 !== index ? ', ' : '');
            })

            return (<span v-tooltip={{
              delay: {show: 500, hide: 100},
              content: tagsetsString && tagsetsString > 50 && tagsetsString
            }}>{this.$options.filters.crop(tagsetsString, 50)}</span>);
          },
        },
        {
          field: "buttons", key: "buttons", align: "left",
          renderBodyCell: ({row}) => {
            return (<span style="display: flex;">
              <el-icon name="edit" v-tooltip={this.$t('buttons.edit')}
                       style="cursor: pointer; margin-right: 10px; width: 24px; height: 24px"
                       on-click={() => this.onClickEditBlock(row)}/>
          <el-remove on-click={() => this.openTagBlockRemoveConfirmation(row)}/>
            </span>)
          }
        },
      ],
    }
  },
  beforeMount() {
    this.$store.dispatch('tagsState/actionGetTagSetsPhoto')
  },
  beforeDestroy() {
    this.$store.commit('tagsState/mutateClearTagSetsState')
  },
  methods: {
    onClickEditBlock(block) {
      if (this.$store.getters["workspacesState/getActiveWorkspaceUserLicenseValid"]) this.$store.commit('tagsState/mutateEditedTagBlock', block)
      else this.$store.commit('mutateShowGoProPopup', true)
    },
    onClickAddBlock() {
      if (this.$store.getters["workspacesState/getActiveWorkspaceUserLicenseValid"]) this.$store.commit('tagsState/mutateEditedTagBlock', {})
      else this.$store.commit('mutateShowGoProPopup', true)
    },
    openTagBlockRemoveConfirmation(block) {
      this.$swal.fire({
        title: this.$t('notification.sure'),
        text: this.$t('workspace.cannotRevertThis'),
        showCancelButton: true,
        cancelButtonText: this.$t('buttons.cancel'),
        confirmButtonText: this.$t('buttons.delete'),
        icon: 'warning',
      }).then((result) => {
        if (result.isConfirmed) this.$store.dispatch('tagsState/actionDeleteTagBlock', block);
      })
    },
  }
}
</script>

<style scoped>

</style>
