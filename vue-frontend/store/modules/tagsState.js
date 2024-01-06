import Vue from 'vue';
import {i18n} from '@/plugins/i18n';

export default {
    namespaced: true,
    state: () => ({
        tags: null,
        tagBlocks: null,
        tagSets: null,

        editedTag: null,
        editedTagErrors: {},

        editedTagBlock: null,
        editedTagBlockErrors: {},

        editedTagSet: null,
        editedTagSetErrors: {},
    }),
    getters: {},
    actions: {
        actionGetTagUsage({rootState}, tag) {
            return Vue.$axios({
                method: 'GET',
                url: `${rootState.host}/v2d/workspace/tag/${tag.objectId}`,
                _preloader: true,
                _auth: true
            })
        },
        actionDeleteTag({rootState, commit, dispatch}, tag) {
            Vue.$axios({
                method: 'DELETE',
                url: `${rootState.host}/v2d/workspace/tag`,
                _preloader: true,
                data: tag,
                _auth: true
            }).then(() => {
                commit('mutateRemoveTag', tag)
                dispatch('notify', i18n.t('notification.workSaved'), {root: true})
            })
        },
        actionDeleteTagBlock({rootState, commit, dispatch}, block) {
            Vue.$axios({
                method: 'DELETE',
                url: `${rootState.host}/v2d/workspace/tag-block`,
                _preloader: true,
                data: block,
                _auth: true
            }).then(() => {
                commit('mutateRemoveTagBlock', block)
                dispatch('notify', i18n.t('notification.workSaved'), {root: true})
            })
        },
        actionDeleteTagSet({rootState, commit, dispatch}, set) {
            return Vue.$axios({
                method: 'DELETE',
                url: `${rootState.host}/v2d/workspace/tag-set`,
                _preloader: true,
                data: set,
                _auth: true
            }).then(() => {
                commit('mutateRemoveTagSet', set)
                dispatch('notify', i18n.t('notification.workSaved'), {root: true})
            })
        },
        actionDeleteTagSetWithTags({rootState, commit, dispatch}, set) {
            Vue.$axios({
                method: 'DELETE',
                url: `${rootState.host}/v2d/workspace/tag-set/with-tags`,
                _preloader: true,
                data: set,
                _auth: true
            }).then(() => {
                commit('mutateRemoveTagSet', set)
                dispatch('notify', i18n.t('notification.workSaved'), {root: true})
            })
        },

        actionArchiveWorkspaceTag({rootState, commit, dispatch}, tag) {
            Vue.$axios({
                method: 'PATCH',
                url: `${rootState.host}/v2d/workspace/tag`,
                _preloader: true,
                data: tag,
                _auth: true
            }).then((resp) => {
                commit('mutateTagsUpdateOrPush', resp.data)
                dispatch('notify', i18n.t('notification.workSaved'), {root: true})
            })
        },
        actionGetTagBlock({state, rootState}, tagBlockId) {
            return new Promise((res) => Vue.$axios({
                method: 'GET',
                url: `${rootState.host}/v2d/workspace/tag-block/${tagBlockId}`,
                _preloader: true,
                _auth: true
            }).then(resp => {
                state.tags = resp.data.tags;
                state.editedTagBlock = resp.data.tagBlock || {};
                res();
            }))
        },


        actionUpdateEditedTagBlock({rootState, state, dispatch, commit}) {
            return new Promise((res, rej) => {
                Vue.$axios({
                    method: 'POST',
                    url: `${rootState.host}/v2d/workspace/tag-block`,
                    _preloader: true,
                    data: state.editedTagBlock.name ? state.editedTagBlock : {...state.editedTagBlock, name: i18n.t('workspace.blockName')},
                    _auth: true
                }).then((resp) => {
                    dispatch('notify', i18n.t('notification.workSaved'), {root: true})
                    commit('mutateTagBlocksUpdateOrPush', resp.data)
                    res(resp.data)
                }).catch(err => {
                    console.log(err);
                    rej(err)
                });
            })
        },
        actionRefreshTagsUsage({rootState, state, dispatch, commit}) {
            return new Promise((res, rej) => {
                Vue.$axios({
                    method: 'POST',
                    url: `${rootState.host}/v2d/workspace/tag/refresh`,
                    _preloader: true,
                    _auth: true
                }).then((resp) => {
                    dispatch('notify', i18n.t('buttons.done'), {root: true})
                    state.tags = resp.data
                    commit('mutateTagBlocksUpdateOrPush', resp.data)
                    res(resp.data)
                }).catch(err => {
                    console.log(err);
                    rej(err)
                });
            })
        },
        actionUpdateEditedTagSet({rootState, state, dispatch, commit}) {
            return new Promise((res, rej) => Vue.$axios({
                method: 'POST',
                url: `${rootState.host}/v2d/workspace/tag-set`,
                _preloader: true,
                data: state.editedTagSet.name ? state.editedTagSet : {...state.editedTagSet, name: i18n.t('workspace.tagSetsName')},
                _auth: true
            }).then((resp) => {
                dispatch('notify', i18n.t('notification.workSaved'), {root: true})
                commit('mutateEditedTagSet', resp.data)
                commit('mutateTagSetsUpdateOrPush', resp.data)
                res(resp.data);
            }).catch(err => {
                console.log(err);
                rej()
            }));
        },

        actionUpdateEditedTag({rootState, state, dispatch, commit}) {
            return new Promise((res, rej) => Vue.$axios({
                method: 'POST',
                url: `${rootState.host}/v2d/workspace/tag`,
                _preloader: true,
                data: state.editedTag,
                _auth: true
            }).then((resp) => {
                dispatch('notify', i18n.t('notification.workSaved'), {root: true})
                commit('mutateEditedTag', null)
                commit('mutateTagsUpdateOrPush', resp.data)
                res(resp.data)
            }).catch(err => {
                console.log(err);
                rej(err)
            }));
        },
    },
    mutations: {
        mutateClearTagSetsState: (state) => {
            state.tags = null;
        },
        mutateFormsUpdateOrPush: (state, updatedForm) => {
            let forms = state.forms;
            let foundForm = state.forms.findIndex(form => form.objectId === updatedForm.objectId)

            if (foundForm !== -1) forms[foundForm] = updatedForm;
            else forms.unshift(updatedForm)

            state.forms = [...forms]
        },
        mutateTagsUpdateOrPush: (state, updatedTag) => {
            let tags = state.tags;
            let foundTag = state.tags && state.tags.findIndex(tag => tag.objectId === updatedTag.objectId)

            if (foundTag !== -1) tags[foundTag] = updatedTag;
            else tags.unshift(updatedTag)

            state.tags = [...tags]
        },
        mutateTagBlocksUpdateOrPush: (state, updatedBlock) => {
            let tags = state.tagBlocks;
            let foundBlock = state.tagBlocks && state.tagBlocks.findIndex(block => block.objectId === updatedBlock.objectId)

            if (foundBlock !== -1) tags[foundBlock] = updatedBlock;
            else tags.unshift(updatedBlock)

            state.tagBlocks = [...tags]
        },
        mutateTagSetsUpdateOrPush: (state, updatedSet) => {
            let tags = state.tagSets;
            let foundSet = state.tagSets.findIndex(set => set.objectId === updatedSet.objectId)

            if (foundSet !== -1) tags[foundSet] = updatedSet;
            else tags.unshift(updatedSet)

            state.tagSets = [...tags]
        },
        mutateRemoveTag(state, tag) {
            state.tags = state.tags.filter(item => item.objectId !== tag.objectId)
        },
        mutateRemoveTagBlock(state, block) {
            state.tagBlocks = state.tagBlocks.filter(item => item.objectId !== block.objectId)
        },
        mutateRemoveTagSet(state, set) {
            state.tagSets = state.tagSets.filter(item => item.objectId !== set.objectId)
        },
        mutateEditedForm: function (state, form) {
            state.editedForm = form ? {...form} : form
        },
        mutateEditedTag: function (state, tag) {
            state.editedTag = tag ? {...tag} : tag
        },
        mutateEditedTagBlock: function (state, block) {
            state.editedTagBlock = block ? {...block} : block
        },
        mutateEditedTagSet: function (state, set) {
            state.editedTagSet = set ? {...set} : set
        },
        mutateEditedFormErrors: function (state, payload) {
            for (let [id, value] of Object.entries(payload)) {
                state.editedFormErrors = {...state.editedFormErrors, [id]: value}
            }
        },
        mutateEditedFormProperty: function (state, payload) {
            for (let [id, value] of Object.entries(payload)) {
                state.editedForm = {...state.editedForm, [id]: value}
            }
        },
        mutateEditedTagErrors: function (state, payload) {
            for (let [id, value] of Object.entries(payload)) {
                state.editedTagErrors = {...state.editedTagErrors, [id]: value}
            }
        },
        mutateEditedTagBlockErrors: function (state, payload) {
            for (let [id, value] of Object.entries(payload)) {
                state.editedTagBlockErrors = {...state.editedTagBlockErrors, [id]: value}
            }
        },
        mutateEditedTagSetErrors: function (state, payload) {
            for (let [id, value] of Object.entries(payload)) {
                state.editedTagSetErrors = {...state.editedTagSetErrors, [id]: value}
            }
        },
        mutateEditedTagProperty: function (state, payload) {
            for (let [id, value] of Object.entries(payload)) {
                state.editedTag = {...state.editedTag, [id]: value}
            }
        }
    }

};
