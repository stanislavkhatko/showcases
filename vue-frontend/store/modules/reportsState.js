import Vue from "vue";
import {i18n} from "@/plugins/i18n";

export default {
    namespaced: true,
    state: () => ({
        reports: null,
        reportsCount: null,
        editedReport: null,
        editedForm: null,
        userSignatures: null,
        editedFormErrors: {},
    }),
    getters: {},
    actions: {
        actionGetReports({rootState, commit, state}, config) {
            return new Promise((res, rej) => {
                Vue.$axios({
                    method: 'GET',
                    url: `${rootState.host}/v2d/reports/`,
                    params: {page: config.page, search: config.search, date: config.date},
                    _preloader: config.preloader,
                    _auth: true
                }).then(resp => {
                    commit('mutateReports', resp.data.reports)
                    state.reportsCount = resp.data.reportsCount
                    res()
                }).catch(err => {
                    console.log(err);
                    rej()
                });
            })
        },
        actionGetEditedForm({rootState, commit}) {
            Vue.$axios({
                method: 'GET',
                url: `${rootState.host}/v2d/reports/form`,
                _preloader: true,
                _auth: true
            }).then(resp => {
                commit('mutateEditedForm', resp.data.form)
                commit('mutateUserSignatures', resp.data.userSignatures)
            }).catch(err => {
                console.log(err);
            });
        },
        actionUpdateEditedForm({rootState, state, dispatch, commit}) {
            Vue.$axios({
                method: 'POST',
                url: `${rootState.host}/v2d/form`,
                _preloader: true,
                data: state.editedForm,
                _auth: true
            }).then(() => {
                dispatch('notify', i18n.t('notification.workSaved'), {root: true})
                commit('mutateEditedForm', null)
                commit('mutateUserSignatures', null)
            }).catch(err => {
                console.log(err);
            });
        },
        actionUpdateEditedReport({rootState, state, dispatch, commit}) {
            Vue.$axios({
                method: 'POST',
                url: `${rootState.host}/v2d/reports`,
                _preloader: true,
                data: state.editedReport,
                _auth: true
            }).then(() => {
                dispatch('notify', i18n.t('notification.workSaved'), {root: true})

                commit('mutateReports', state.reports.map(item => {
                    if (item.objectId === state.editedReport.objectId) return state.editedReport
                    else return item;
                }))
                commit('mutateEditedReport', null)
            }).catch(err => {
                console.log(err);
            });
        },
        actionDestroyReports({commit}) {
            commit('mutateReports', null)
        },
    },
    mutations: {
        mutateReports: function (state, reports) {
            state.reports = reports || null
        },
        mutateEditedReport: function (state, report) {
            state.editedReport = report || null
        },
        mutateUserSignatures: function (state, userSignatures) {
            state.userSignatures = userSignatures
        },
        mutateEditedForm: function (state, form) {
            state.editedForm = form
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
        }
    }

};
