import Vue from 'vue';
import VueLazyload from 'vue-lazyload';
import App from '@/App.vue';
import store from '@/store';
import router from './router';
import '@/plugins/axios';
import '@/plugins/firebase';
import '@/plugins/sweetalert';
import '@/plugins/sentry'
import '@/plugins/vue'
import TextareaAutosize from 'vue-textarea-autosize'
import VTooltip from 'v-tooltip'
import 'regenerator-runtime/runtime'


import 'vue-easytable/libs/theme-default/index.css'; // import style
import VueEasytable from "vue-easytable"; // import library
import smoothscroll from 'smoothscroll-polyfill';
import {i18n, setDefaultLanguage} from '@/plugins/i18n';

import GmapVue from 'gmap-vue';


Vue.use(VueEasytable);

Vue.use(TextareaAutosize)

smoothscroll.polyfill();

Vue.use(VTooltip, {defaultClass: 'v-tooltip', popover: {defaultClass: 'v-popover',}})

Vue.use(VueLazyload, {
    observer: true,
});

Promise.all([setDefaultLanguage(), store.dispatch('actionGetApp')]).finally(() => {
    Vue.use(GmapVue, {
        load: {
            key: import.meta.env.VITE_APP_GOOGLE_MAPS_KEY,
            libraries: 'places',
            language: i18n.locale
        },
        installComponents: true,
    })

    new Vue({
        store,
        router,
        i18n,
        render: h => h(App)
    }).$mount('#app');
}).catch(() => {
})



