<template>

  <div class="p-photo-tagset" v-if="editedTagSet">

    <div class="top">
      <el-back class="back" :to="{name: 'TagSetsPhoto'}">
        {{ $t('workspace.tagSets') }}
      </el-back>
    </div>


    <h3 style="margin-top: 50px;">{{
        editedTagSet.objectId ? $t('workspace.editTagSet') : $t('workspace.addTagSet')
      }}</h3>

    <div class="content">

      <div class="left">

        <el-input style="margin-top: 0;" :label="$t('workspace.blockName')" max-length="60" v-model="editedTagSet.name"
                  :error.sync="editedTagSetErrors.name"/>

        <h4 style="margin-top: 30px;">{{ $t('workspace.fields') }}</h4>

        <div class="row">
          <el-select style="flex: 1; margin-right: 10px;" v-model="selectedTag" @input="pushTagOrBlockToList"
                     :label="$t('workspace.selectField')"
                     :options="computedTagsToAdd"
                     option-label="name"/>

          <el-button style="margin-top: 20px;"
                     type="secondary" icon="add"
                     @click="$store.commit('tagsState/mutateEditedTag', {relation: 'PhotoProof'})">
            {{ $t('workspace.addTag') }}
          </el-button>
        </div>

        <!--                <div class="row" v-if="$store.getters['workspacesState/getActiveWorkspaceDefaultTagValuesEnabled']">-->
        <div class="row">
          <el-select style="flex: 1; margin-right: 10px;" v-model="selectedProjectTag"
                     @input="pushTagOrBlockToList"
                     :label="$t('workspace.selectProjectField')"
                     :options="computedProjectTagsToAdd"
                     option-label="name"/>

          <el-button style="margin-top: 20px;"
                     type="secondary" icon="add"
                     @click="$store.commit('tagsState/mutateEditedTag', {relation: 'Project'})">
            {{ $t('workspace.addTag') }}
          </el-button>
        </div>

        <div class="row">
          <el-select style="flex: 1; margin-right: 10px;" v-model="selectedBlock"
                     @input="pushTagOrBlockToList"
                     :label="$t('workspace.selectTagBlock')"
                     :options="computedBlocksToAdd"
                     option-label="name"/>

          <el-button style="margin-top: 20px;"
                     type="secondary" icon="add"
                     @click="addNewBlock">
            {{ $t('workspace.addTagBlock') }}
          </el-button>
        </div>

        <div class="tags">

          <el-input-label v-if="computedTagsetTags && computedTagsetTags.length > 2"
                          :value="$t('workspace.dragToChangeOrder')"/>

          <draggable v-model="editedTagSet.tags" handle=".handle" :disabled="false" :animation="100">
            <div class="tag" v-for="tagOrBlock in computedTagsetTags" :key="tagOrBlock.objectId">
              <div class="handle">
                <el-icon name="arrow-2"/>
              </div>
              <!--              <div class="name">{{ tagOrBlock.name }}</div>-->
              <div class="name" @click="editTagOrBlock(tagOrBlock)"
                   v-tooltip="{delay: { show: 2000, hide: 100 }, content: tagOrBlock.name && tagOrBlock.name.length > 50 && tagOrBlock.name}">
                {{
                  tagOrBlock.name && tagOrBlock.name.length > 50 ? tagOrBlock.name.substring(0, 50).concat('...') : tagOrBlock.name
                }}
              </div>
              <div class="type" v-if="tagOrBlock.relation">
                <div>{{ $t(`fieldType.${tagOrBlock.type}`) }}</div>
                <div v-if="tagOrBlock.relation === 'Project'"
                     style="font-weight: 500; font-size: 12px;">
                  {{ $t('workspace.projectField') }}
                </div>
              </div>
              <div class="type" v-else><b>{{ $t('workspace.tagBlock') }}</b></div>
              <div class="actions">
                <el-icon style="margin-right: 10px" name="edit"
                         @click="editTagOrBlock(tagOrBlock)"
                         v-tooltip="{delay: { show: 500, hide: 100 }, content: $t('buttons.edit')}"/>
                <el-icon style="color: red;" name="close-square"
                         @click="removeTagFromTagset(tagOrBlock)"
                         v-tooltip="{delay: { show: 500, hide: 100 }, content: $t('buttons.remove')}"/>
              </div>
            </div>
          </draggable>

        </div>


      </div>

      <div class="right">
        <img style="max-width: 100%"
             :src="($store.getters.locale && $store.getters.locale === 'de') ? require('@/assets/tagset_preview_de.png') : require('@/assets/tagset_preview.png')"
             alt="preview">
        <div class="info">{{ $t('workspace.tagSetFormInfo') }}</div>
      </div>

    </div>

    <el-button style="margin-top: 20px;" size="large" icon="tick-square" @click="submit">{{ $t('buttons.save') }}
    </el-button>
  </div>

</template>

<script>
import {mapMutations, mapState} from "vuex";
import draggable from 'vuedraggable'
import {i18n} from "@/plugins/i18n";


export default {
  name: "TagSetForm",
  title: i18n.t('pages.tagSet'),
  data() {
    return {
      selectedTag: null,
      selectedProjectTag: null,
      selectedBlock: null,
      originalTagset: null,
    }
  },
  components: {draggable},
  computed: {
    ...mapState('tagsState', ['tags', 'tagBlocks', 'tagSets', 'editedTagSet', 'editedTagSetErrors']),
    photoProofTags() {
      return this.tags && this.tags.filter(tag => tag.objectId && tag.relation === 'PhotoProof')
    },
    computedTagsToAdd() {
      return this.tags && this.tags.filter(t => t.relation === 'PhotoProof').filter(tag => !(this.editedTagSet.tags && this.editedTagSet.tags.includes(tag.objectId)))
    },
    computedProjectTagsToAdd() {
      return this.tags && this.tags.filter(t => t.relation === 'Project').filter(tag => !(this.editedTagSet.tags && this.editedTagSet.tags.includes(tag.objectId)))
    },
    computedBlocksToAdd() {
      return this.tagBlocks && this.tagBlocks.filter(tag => !(this.editedTagSet.tags && this.editedTagSet.tags.includes(`tag_block_${tag.objectId}`)))
    },
    computedTagsetTags() {
      let collector = [];

      this.editedTagSet && this.editedTagSet.tags && this.editedTagSet.tags.map(tagId => {
        let tag;

        if (tagId.startsWith('tag_block_')) {
          tag = this.tagBlocks && this.tagBlocks.find(t => `tag_block_${t.objectId}` === tagId);
        } else {
          tag = this.tags && this.tags.find(t => t.objectId === tagId);
        }
        if (tag) collector.push(tag)
      })

      return collector;
    }
  },
  beforeMount() {
    this.$store.dispatch('tagsState/actionGetTagSetsPhoto').then((() => {
      let tagSet = this.$route.params.id && this.tagSets && this.tagSets.find(set => set.objectId === this.$route.params.id) || {}
      this.originalTagset = tagSet;
      this.$store.commit('tagsState/mutateEditedTagSet', tagSet)
    }))
  },
  beforeDestroy() {
    this.$store.commit('tagsState/mutateClearTagSetsState')
  },
  beforeRouteLeave(to, from, next) {
    this.closeTagSetConfirmed().then(() => {
      next();
    })
  },
  methods: {
    closeTagSetConfirmed() {
      return new Promise((res, rej) => {
        JSON.stringify(this.originalTagset) !== JSON.stringify(this.editedTagSet) ? this.$swal.fire({
          title: this.$t('gallery.sureClosePhotoForm'),
          showCancelButton: true,
          showCloseButton: true,
          cancelButtonText: this.$t('buttons.continueWithoutSave'),
          confirmButtonText: this.$t('buttons.saveChanges'),
          icon: 'warning',
        }).then((result) => {
          if (result.isConfirmed) this.submit()
          if (result.isDismissed && result.dismiss === 'cancel') res(true)
        }) : res(true)
      })
    },

    addNewBlock() {
      this.$store.commit('tagsState/mutateEditedTagBlock', {})
    },
    editTagOrBlock(block) {
      if (block.relation) {
        this.$store.commit('tagsState/mutateEditedTag', block)
      } else {
        this.$store.commit('tagsState/mutateEditedTagBlock', block)
      }
    },
    removeTagFromTagset(tag) {
      let tagset = this.editedTagSet;

      tagset.tags = tagset.tags && tagset.tags.filter(tId => tag.relation ? tId !== tag.objectId : tId !== `tag_block_${tag.objectId}`)

      this.$store.commit('tagsState/mutateEditedTagSet', tagset)
    },
    pushTagOrBlockToList(tagOrBlock) {
      if (tagOrBlock.objectId) {

        let tagset = {...this.editedTagSet};

        if (tagOrBlock.relation) {
          tagset.tags = tagset.tags ? (tagset.tags.includes(tagOrBlock.objectId) ? tagset.tags : [...tagset.tags, tagOrBlock.objectId]) : [tagOrBlock.objectId];
        } else {
          let blockId = `tag_block_${tagOrBlock.objectId}`;
          tagset.tags = tagset.tags ? (tagset.tags.includes(blockId) ? tagset.tags : [...tagset.tags, blockId]) : [blockId];
        }

        tagset.name = tagset.name || '';

        this.selectedTag = null
        this.selectedProjectTag = null
        this.selectedBlock = null
        this.$store.commit('tagsState/mutateEditedTagSet', tagset)
      }
    },
    ...mapMutations('tagsState', ['mutateEditedTagErrors', 'mutateEditedTagProperty', 'mutateEditedTagSetErrors']),
    submit() {

      if (!this.editedTagSet.name) this.mutateEditedTagSetErrors({name: this.$t('workspace.required')})
      if (!this.editedTagSet.tags || !this.editedTagSet.tags.length) return this.$swal.fire('', this.$t('workspace.tagSetTagsRequired'), 'error')

      for (let value of Object.values(this.editedTagSetErrors)) {
        if (value) return;
      }

      this.$store.dispatch('tagsState/actionUpdateEditedTagSet').then(tagSet => this.originalTagset = tagSet)
    },
  }
}
</script>

<style lang="scss" scoped>

.p-photo-tagset {
  max-width: 900px;
  margin-top: 30px;

  & .content {
    display: flex;
    flex-wrap: wrap;
  }

  & .left {
    flex: 1;
    margin-right: 20px;

    & .title {
      margin-top: 30px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }

    & .row {
      display: flex;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    & .tags {
      margin: 30px 0;

      & .sortable-drag {
        opacity: 0;
      }

      & .sortable-chosen {
        font-weight: 500;
      }

      & .tag {
        display: flex;
        margin-top: 10px;

        & .handle {
          display: flex;
          margin-right: 10px;
          rotate: 90deg;
          max-width: 24px;
          max-height: 24px;

          & svg {
            cursor: move;
          }
        }

        & .name {
          margin-right: 5px;
          flex: 1;
          cursor: pointer;
        }

        & .type {
          overflow: hidden;
          min-width: 200px;
          margin-right: 10px;
        }

        & .actions {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  & .right {
    flex: 1;
    border: 1px solid #E6E6E6;
    border-radius: 12px;
    padding: 10px;
  }

}

</style>
