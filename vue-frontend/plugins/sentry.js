import * as Sentry from "@sentry/vue";

if (import.meta.env.VITE_APP_SENTRY_ENVIRONMENT !== 'localhost') {
    Sentry.init({});

    Sentry.setTags({})
}
