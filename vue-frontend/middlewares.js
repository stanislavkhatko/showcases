import store from "@/store";
// Frontend middlewares for routes


const hasRole = ({next, router}) => {
    if (!store.getters["userState/getUserRole"]) {
        return router.push({name: 'Projects'}).catch(() => {
        });
    }

    return next();
};


const isAuthorized = ({router, next}) => {

    if (!store.getters['userState/isAuthorized']) {
        store.dispatch('userState/actionUserLogout').then(() => {
        })

        return router.push('/auth/login').catch(() => {
        })
    }

    return next();
};

const hasAppData = ({next}) => {
    next();
}

const notAuthorized = ({router, next}) => {
    if (store.getters['userState/isAuthorized']) {
        return router.push({name: 'Projects'}).catch(() => {
        });
    }
    return next();
};

export {
    hasAppData,
    isAuthorized,
    notAuthorized,
    hasRole,
}


