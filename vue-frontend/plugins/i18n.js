import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messages from '@/locales/en';

Vue.use(VueI18n);

const allMessages = {
    en: messages
};

export const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: allMessages,
    pluralizationRules: {}
});

export const availableLocales = ['en','ua'];
const loadedLanguages = ['en'];

function setI18nLanguage(lang) {
    i18n.locale = lang;
    document.querySelector('html').setAttribute('lang', lang);
    return lang;
}

export function loadLanguageAsync(lang) {
    // If the same language
    if (i18n.locale === lang) {
        return Promise.resolve(setI18nLanguage(lang));
    }

    // If the language was already loaded
    if (loadedLanguages.includes(lang)) {
        return Promise.resolve(setI18nLanguage(lang));
    }

    // If the language hasn't been loaded yet
    return new Promise(res => {
        import(`@/locales/${lang}.js`).then(
            messages => {
                allMessages[lang] = messages.default;
                loadedLanguages.push(lang);
                setI18nLanguage(lang);
                res();
            }
        );
    });
}
