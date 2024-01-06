import Vue from 'vue';
import Vuex from 'vuex';
import userState from './modules/userState';
import galleryState from './modules/galleryState';
import projectsState from './modules/projectsState';
import projectState from "./modules/projectState";
import photoProofState from "./modules/photoProofState";
import downloadState from "./modules/downloadState";
import reportState from "./modules/reportState";
import workspacesState from "./modules/workspacesState";
import tagsState from "./modules/tagsState";
import workspaceState from "./modules/workspaceState";
import teamsState from './modules/teamsState';
import reportsState from './modules/reportsState';
import authState from './modules/authState';
import adminState from './modules/adminState';
import processState from './modules/processState';
import {i18n} from "@/plugins/i18n";

Vue.use(Vuex);

const store = new Vuex.Store({

    state: {
        locale: i18n.locale,
        origin: window.location.origin,
        host: import.meta.env.VITE_APP_ENV === 'dev' ? import.meta.env.VITE_APP_API_DEV_HOST : import.meta.env.VITE_APP_API_PROD_HOST,
        loading: false,
        error: null,
        windowWidth: null,
        windowHeight: null,
        scrollTop: null,
        showSidebar: true,
        development: import.meta.env.VITE_APP_DEVELOPMENT,
        localhost: import.meta.env.VITE_APP_LOCALHOST,

        showReportIssue: false,
        reportIssue: {},

        showGoProPopup: false,
    },
    getters: {
        locale() {
            return i18n.locale
        },
        isDevelopment(state) {
            return state.development
        },
        isLocalhost(state) {
            return state.localhost
        },
        isLoading(state) {
            return state.loading;
        },
    },
    mutations: {
        mutatePreloader(state, val) {
            if (state.loading !== val) state.loading = val;
        },
        mutateShowGoProPopup(state, val) {
            state.showGoProPopup = val;
        },
        mutateWindowWidth(state, width) {
            state.windowWidth = width;
        },
        mutateScrollTop(state, scroll) {
            state.scrollTop = scroll;
        },
        mutateWindowHeight(state, height) {
            state.windowHeight = height;
        },
        mutateShowSidebar(state, value) {
            state.showSidebar = value;
        },
        mutateShowReportIssue(state, value) {
            state.showReportIssue = value;
            state.reportIssue = {}
        },
        mutateReportIssue: function (state, payload) {
            for (let [id, value] of Object.entries(payload)) {
                state.reportIssue = {...state.reportIssue, [id]: value}
            }
        },
    },
    actions: {
        actionReportIssue({state, dispatch}) {
            return new Promise((res, rej) => {
                Vue.$axios({
                    method: 'POST',
                    url: `${state.host}/v2d/report-issue/`,
                    _preloader: true,
                    data: state.reportIssue,
                    _auth: true
                }).then(resp => {
                    dispatch('notify', i18n.t('general.reportIssueSent'), {root: true})

                    res(resp.data)
                }).catch(error => {
                    dispatch('notify', i18n.t('general.reportIssueFailed'), {root: true})

                    rej(error.response.data)
                })
            })
        },
        actionSetShowSidebar({state, commit}) {
            if (state.windowWidth && state.windowWidth < 1500)
                commit('mutateShowSidebar', false)
        },
        setAppUser({commit}, user) {
            commit('userState/mutateUser', user);
        },
        actionGetApp({commit, getters, rootState, dispatch}) {
            return new Promise((res, rej) => {

                if (getters['userState/getSessionToken']) Vue.$axios({
                    url: `${rootState.host}/v2d/init/`,
                    _preloader: true,
                    _auth: true
                }).then(resp => {
                    dispatch('setUpApp', resp.data)
                    res(resp)
                }).catch(() => {
                    rej();
                })

                else rej('noSessionToken')
            })
        },
        notify(context, data) {
            let params = {
                toast: true,
                position: 'top-end',
                icon: 'success',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            }

            Vue.swal.fire(Object.assign({}, params, typeof data === "string" ? {title: data} : data))
        }
    },
    modules: {
        userState,
        galleryState,
        teamsState,
        projectState,
        projectsState,
        workspacesState,
        tagsState,
        reportState,
        downloadState,
        workspaceState,
        reportsState,
        authState,
        photoProofState,
        processState,
        adminState,
    }
});

export default store;
