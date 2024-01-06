import Vue from 'vue';
import axios from 'axios';

let config = {};

const _axios = axios.create(config);

const requestInterceptor = (config) => {

    if (config._auth) {
    }

    if (config._preloader) {
    }

    return config;
};

const requestErrInterceptor = (err) => {

    if (err.config && err.config._preloader) {
    }

    return Promise.reject(err);
};

const responseInterceptor = (resp) => {

    if (resp.config._preloader) {}

    return resp;
};

const responseErrInterceptor = (err) => {
    if (err.response && err.response.status === 401 && !err.config._preventUserClear) { }

    if (err.config && err.config._preloader) { }

    return Promise.reject(err);
};

_axios.interceptors.request.use(requestInterceptor, requestErrInterceptor);
_axios.interceptors.response.use(responseInterceptor, responseErrInterceptor);


Plugin.install = function (Vue) {
    Vue.$axios = _axios;
    Object.defineProperties(Vue.prototype, {
        $axios: {
            get() {
                return _axios;
            }
        }
    });
};

Vue.use(Plugin);

export default Plugin;
