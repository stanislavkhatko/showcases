<template>

  <div class="c-form-tags">

    <el-info-box style="margin-top: 20px;" :image="require('@/assets/info_picture.svg')">
      <h3>{{ $t('workspace.formTags') }}</h3>
            <p v-html="$t('workspace.formTagsHint1')"></p>

      <el-button type="secondary" style="margin-top: 20px;" size="small" icon="add"
                 @click="addFormTag">
        {{ $t('workspace.addTag') }}
      </el-button>
    </el-info-box>

    <el-table style="display: flex" v-if="$store.state.tagsState.tags && $store.state.tagsState.tags.length"
              :columns="tagsColumns" :fixed-header="true"
              :table-data="$store.state.tagsState.tags"/>

  </div>

</template>

<script lang="jsx">
export default {
  name: "FormTags",
  data() {
    return {
      tagsColumns: [
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
          title: this.$t('workspace.tagName'),
          align: "left",
          width: '150px',
          fixed: 'left',
          renderBodyCell: ({row}) => {
            return (<b>{row.name}</b>);
          },
        },
        {
          field: "type", key: "type", title: this.$t('workspace.tagKind'), align: "left",
          renderBodyCell: ({row}) => {
            return (<span>{this.$t(`workspace.${row.type}`)}</span>)
          },
        },
        {
          field: "buttons", key: "buttons", align: "right",
          renderBodyCell: ({row}) => {
            return (<span style="display: flex; align-items: center">
              <el-icon name="edit" v-tooltip={this.$t('buttons.edit')}
                       style="cursor: pointer; margin-right: 10px; width: 24px; height: 24px;"
                       on-click={() => this.$store.commit('tagsState/mutateEditedTag', row)}/>
            <el-remove on-click={() => this.openTagRemoveConfirmation(row)}/>
            </span>)
          }
        },
      ],
    }
  },
  methods: {
    addFormTag() {
      if (this.$store.getters["workspacesState/getActiveWorkspaceUserLicenseValid"]) this.$store.commit('tagsState/mutateEditedTag', {relation: 'Form'})
      else this.$store.commit('mutateShowGoProPopup', true)
    },
    openTagRemoveConfirmation(tag) {
      this.$swal.fire({
        title: this.$t('notification.sure'),
        text: this.$t('workspace.cannotRevertThis'),
        showCancelButton: true,
        cancelButtonText: this.$t('buttons.cancel'),
        confirmButtonText: this.$t('buttons.delete'),
        icon: 'warning',
      }).then((result) => {
        if (result.isConfirmed) this.$store.dispatch('tagsState/actionDeleteTag', tag);
      })
    },
  },
  beforeMount() {
    this.$store.dispatch('tagsState/actionGetTagSetsForm')
  },
  beforeDestroy() {
    this.$store.commit('tagsState/mutateClearTagSetsState')
  }
}
</script>

<style lang="scss" scoped>

.c-form-tags {
  & .title {
    font-size: 18px;
    margin: 40px 0 20px;
    display: flex;
    align-items: center;
  }
}

</style>
