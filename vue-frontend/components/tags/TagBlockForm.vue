<template>
  <el-popup class="c-tag-block-form" v-if="editedTagBlock" @close="closePopup">

    <template v-slot:top>
      {{
        (editedTagBlock && editedTagBlock.objectId) ? $t('workspace.editTagBlock') : $t('workspace.addTagBlock')
      }}
    </template>

    <template v-slot:content>
      <div class="content">

        <div class="left">
          <el-input style="margin-top: 0;" :label="$t('workspace.blockName')" v-model="editedTagBlock.name"
                    :maxLength="80"
                    :error.sync="editedTagBlockErrors.name"/>

          <el-textarea :label="$t('workspace.blockDescription')" v-model="editedTagBlock.desc" :maxLength="500"
                       :error.sync="editedTagBlockErrors.desc"/>

          <!-- :disabled="editedTagBlock.objectId" -->
          <el-checkbox :label="$t('workspace.tagBlockRepeated')" inline="yes" :value="true"
                       :checked="editedTagBlock.repeatable" @change="setTagBlockRepeated($event)"/>

          <div class="row">
            <el-select style="flex: 1; margin-right: 10px" v-model="selectedTag" @input="pushTagToList"
                       :label="$t('workspace.selectField')" :reduce="item => item.objectId"
                       :options="computedTags"
                       option-label="name"/>
            <el-button style="margin-top: 20px;"
                       type="secondary" icon="add"
                       @click="$store.commit('tagsState/mutateEditedTag', {relation: 'PhotoProof'})">
              {{ $t('workspace.addTag') }}
            </el-button>
          </div>

          <div class="row">
            <el-select style="flex: 1; margin-right: 10px;" v-model="selectedProjectTag"
                       @input="pushTagToList"
                       :label="$t('workspace.selectProjectField')"
                       :options="computedProjectTagsToAdd"
                       :reduce="item => item.objectId"
                       option-label="name"/>

            <el-button style="margin-top: 20px;"
                       type="secondary" icon="add"
                       @click="$store.commit('tagsState/mutateEditedTag', {relation: 'Project'})">
              {{ $t('workspace.addTag') }}
            </el-button>
          </div>

          <div class="tags">
            <el-input-label v-if="computedBlockTags && computedBlockTags.length > 2"
                            :value="$t('workspace.dragToChangeOrder')"/>

            <draggable v-model="editedTagBlock.tags" handle=".handle" :disabled="false" :animation="100">
              <div class="tag" v-for="tag in computedBlockTags" :key="tag.objectId">
                <div class="handle">
                  <el-icon name="arrow-2"/>
                </div>
                <div class="name"
                     v-tooltip="{delay: { show: 2000, hide: 100 }, content: tag.name && tag.name.length > 50 && tag.name}">
                  {{
                    tag.name && tag.name.length > 50 ? tag.name.substring(0, 50).concat('...') : tag.name
                  }}
                </div>
                <div class="type" v-if="tag.relation">
                  <div>{{ $t(`workspace.${tag.type}`) }}</div>
                  <div v-if="tag.relation === 'Project'" style="font-weight: 500; font-size: 12px;">
                    {{ $t('workspace.projectField') }}
                  </div>
                </div>
                <div class="actions">
                  <el-icon style="margin-right: 10px" name="edit"
                           @click="$store.commit('tagsState/mutateEditedTag', tag)"
                           v-tooltip="{delay: { show: 500, hide: 100 }, content: $t('buttons.edit')}"/>
                  <el-icon style="color: red;" name="close-square" @click="removeTagFromTagset(tag)"
                           v-tooltip="$t('buttons.remove')"/>
                </div>
              </div>
            </draggable>

          </div>
        </div>

        <div class="right">
          <img style="max-width: 100%" draggable="false"
               :src="($store.getters.locale && $store.getters.locale === 'de') ? require('@/assets/tagset_preview_de.png') : require('@/assets/tagset_preview.png')">
          <div class="info">{{ $t('workspace.tagSetFormInfo') }}</div>
        </div>

      </div>
    </template>

    <template v-slot:bottom>
      <el-button icon="tick-square" style="margin-top: 20px;" size="large" @click="submit">{{
          $t('buttons.save')
        }}
      </el-button>
    </template>

  </el-popup>

</template>

<script>
import draggable from "vuedraggable";
import {mapMutations, mapState} from "vuex";

export default {
  name: "TagBlockForm",
  title: 'Block',
  components: {draggable},
  data() {
    return {
      selectedTag: null,
      selectedProjectTag: null,
    }
  },
  computed: {
    computedTags() {
      return this.editedTagBlock && this.editedTagBlock.tags && this.tags ? this.tags.filter(i => i.relation === 'PhotoProof').filter(t => this.editedTagBlock && this.editedTagBlock.tags && !this.editedTagBlock.tags.includes(t.objectId)) : this.tags.filter(i => i.relation === 'PhotoProof');
    },
    computedProjectTagsToAdd() {
      return this.editedTagBlock && this.editedTagBlock.tags && this.tags ? this.tags.filter(i => i.relation === 'Project').filter(t => this.editedTagBlock && this.editedTagBlock.tags && !this.editedTagBlock.tags.includes(t.objectId)) : this.tags.filter(i => i.relation === 'Project');
    },
    ...mapState('tagsState', ['tags', 'editedTagBlock', 'editedTagSet', 'editedTagBlockErrors', 'editedTag', 'editedTagErrors']),
    photoProofTags() {
      return this.tags && this.tags.filter(tag => tag.objectId && tag.relation === 'PhotoProof')
    },
    computedBlockTags() {
      let d = [];

      this.editedTagBlock && this.editedTagBlock.tags && this.editedTagBlock.tags.map(tagId => {
        let tag = this.tags && this.tags.find(t => t.objectId === tagId);
        if (tag) d.push(tag)
      })

      return d;
    },
    computedTagsetTags() {
      let d = [];

      this.editedTagSet && this.editedTagSet.tags && this.editedTagSet.tags.map(tagId => {
        let tag = this.tags && this.tags.find(t => t.objectId === tagId);
        if (tag) d.push(tag)
      })

      return d;
    }
  },
  methods: {
    ...mapMutations('tagsState', ['mutateEditedTagBlockErrors', 'mutateEditedTagBlock']),
    closePopup() {
      this.$store.commit('tagsState/mutateEditedTagBlock', null)
    },
    setTagBlockRepeated(value) {
      let block = this.editedTagBlock;
      block.repeatable = value

      this.$store.commit('tagsState/mutateEditedTagBlock', block)
    },
    removeTagFromTagset(tag) {
      let block = this.editedTagBlock;
      block.tags = block.tags && block.tags.filter(tId => tId !== tag.objectId)

      this.$store.commit('tagsState/mutateEditedTagBlock', block)
    },
    pushTagToList(tagId) {
      let block = {...this.editedTagBlock};
      block.tags = block.tags ? (block.tags.includes(tagId) ? block.tags : [...block.tags, tagId]) : [tagId];
      block.name = block.name || '';

      this.selectedTag = null
      this.selectedProjectTag = null
      this.$store.commit('tagsState/mutateEditedTagBlock', block)
    },
    submit() {

      if (!this.editedTagBlock.name) this.mutateEditedTagBlockErrors({name: this.$t('workspace.required')})
      if (!this.editedTagBlock.tags || !this.editedTagBlock.tags.length) return this.$swal.fire('', this.$t('workspace.tagBlockTagsRequired'), 'error')

      for (let value of Object.values(this.editedTagBlockErrors)) {
        if (value) return;
      }

      this.$store.dispatch('tagsState/actionUpdateEditedTagBlock').then((block) => {

        if (this.$route.name === 'TagSetPhoto') {
          let tagset = {...this.editedTagSet};

          let blockId = `tag_block_${block.objectId}`;
          tagset.tags = tagset.tags ? (tagset.tags.includes(blockId) ? tagset.tags : [...tagset.tags, blockId]) : [blockId];

          tagset.name = tagset.name || '';

          this.selectedTag = null
          this.selectedProjectTag = null
          this.$store.commit('tagsState/mutateEditedTagSet', tagset)
          this.$store.dispatch('tagsState/actionUpdateEditedTagSet').then(ts => {
            this.$store.commit('tagsState/mutateEditedTagBlock', null)
            this.$router.push({name: 'TagSetPhoto', params: {id: ts.objectId}}).catch(() => {})
          })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>

.c-tag-block-form {

  & .content {
    display: flex;
    flex-wrap: wrap;

    & .content {

    }

    & .left {
      flex: 1;
      margin-right: 20px;
    }

    & .right {
      flex: 1;
      border: 1px solid #E6E6E6;
      border-radius: 12px;
      padding: 10px;
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

}

</style>
