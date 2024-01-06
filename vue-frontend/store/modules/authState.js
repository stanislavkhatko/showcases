import Vue from "vue";

export default {
    namespaced: true,
    state: () => ({
        email: '',
        password: '',
        companyName: '',
        name: '',
        subscribe: false,

        emailError: '',
        passwordError: '',
    }),
    getters: {},
    actions: {
        actionClearAuthState({commit}) {
            commit('mutateEmail', '')
            commit('mutatePassword', '')
            commit('mutatePasswordError', '')
            commit('mutateEmailError', '')
        },
        actionRegister({dispatch, rootState}, data) {
            return new Promise((res, rej) => {
                Vue.$axios({
                    method: 'POST',
                    url: `${rootState.host}/auth/register`,
                    _preloader: true,
                    _preventUserClear: true,
                    data,
                }).then(resp => {
                    dispatch('setAppUser', resp.data, {root: true}).then(dispatch('actionGetApp', resp.data, {root: true}).then(res))
                }).catch(err => {
                    rej(err.response.data)
                });
            });
        },
        actionLogin({dispatch, rootState}, data = {}) {
            return new Promise((res, rej) => {
                Vue.$axios({
                    method: 'POST',
                    url: `${rootState.host}/auth/login`,
                    _preloader: true,
                    _preventUserClear: true,
                    data
                }).then(resp => {
                    dispatch('setAppUser', resp.data, {root: true}).then(dispatch('actionGetApp', resp.data, {root: true}).then(res))
                    res('user is set')
                }).catch(err => {
                    rej(err.response.data)
                });
            });
        },
    },
    mutations: {
        mutateEmail(state, email) {
            state.email = email
        },
        mutatePassword(state, password) {
            state.password = password
        },
        mutatePasswordError(state, e) {
            state.passwordError = e
        },
        mutateEmailError(state, e) {
            state.emailError = e
        },
        mutateName(state, name) {
            state.name = name
        },
        mutateCompanyName(state, name) {
            state.companyName = name
        },
        mutateSubscribe(state, bool) {
            state.subscribe = bool
        },

    }
};
