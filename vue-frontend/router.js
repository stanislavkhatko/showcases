import Vue from 'vue';
import VueRouter from 'vue-router';
import {
    hasActiveWorkspace,
    hasAppData,
    hasRole,
    hasWorkspaceNotUserRole,
    isAuthorized,
    notAuthorized,
    shouldUpgradeLicense
} from './middlewares'
import store from "@/store";

Vue.use(VueRouter);

const routes = [
    {
        path: '/auth',
        name: 'Auth',
        redirect: () => '/auth/login',
        component: () => import('./layouts/AuthLayout.vue'),
        meta: {middleware: [notAuthorized]},
        children: [
            {
                path: 'login',
                name: 'Login',
                meta: {middleware: [notAuthorized]},
                component: () => import('./components/auth/Login.vue')
            },
            {
                path: 'register',
                name: 'Register',
                meta: {middleware: [notAuthorized]},
                component: () => import('./components/auth/Register.vue')
            },
            {
                path: 'restore',
                name: 'Restore',
                meta: {middleware: [notAuthorized]},
                component: () => import('./components/auth/Restore.vue')
            },
            {
                path: 'apple',
                name: 'AuthApple',
                component: () => import('./components/auth/AuthApple.vue')
            },
            {
                path: '*',
                name: 'Auth404',
                component: () => import('./views/page404.vue')
            },
        ]
    },
    {
        path: '',
        redirect: () => '/dashboard',
    },
    {
        path: '/',
        redirect: () => '/dashboard',
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        redirect: () => '/dashboard/projects',
        meta: {middleware: [isAuthorized, hasAppData]},
        component: () => import('./layouts/DashboardLayout.vue'),
        children: [
            {
                path: 'projects/:id',
                name: 'Project',
                redirect: {name: 'ProjectGallery'},
                meta: {middleware: [isAuthorized, hasAppData, shouldUpgradeLicense]},
                component: () => import('./views/Project.vue'),
                children: [
                    {
                        path: 'gallery',
                        name: 'ProjectGallery',
                        meta: {middleware: [isAuthorized, hasAppData, shouldUpgradeLicense]},
                        component: () => import('./components/project/ProjectGallery.vue'),
                    },
                    {
                        path: 'overview',
                        name: 'ProjectOverview',
                        meta: {middleware: [isAuthorized, hasAppData, shouldUpgradeLicense]},
                        component: () => import('./components/project/ProjectOverview.vue'),
                    },
                    {
                        path: 'files',
                        name: 'ProjectFiles',
                        meta: {middleware: [isAuthorized, hasAppData, shouldUpgradeLicense]},
                        component: () => import('./components/project/ProjectFiles.vue'),
                    },
                    {
                        path: 'members',
                        name: 'ProjectMembers',
                        meta: {middleware: [isAuthorized, hasAppData, shouldUpgradeLicense]},
                        component: () => import('./components/project/ProjectMembers.vue'),
                    },
                    {
                        path: 'not-found',
                        name: 'ProjectNotFound',
                        meta: {middleware: [isAuthorized, hasAppData, shouldUpgradeLicense]},
                        component: () => import('./components/project/ProjectNotFound.vue'),
                    },
                    {
                        path: 'no-rights',
                        name: 'ProjectNoRights',
                        meta: {middleware: [isAuthorized, hasAppData, shouldUpgradeLicense]},
                        component: () => import('./components/project/ProjectNoRights.vue'),
                    },
                ]
            },

            {
                path: 'admin',
                name: 'Admin',
                redirect: () => '/dashboard/admin/users',
                meta: {middleware: [isAuthorized, hasAppData, hasRole]},
                component: () => import('./views/Admin.vue'),
                children: [
                    {
                        path: 'default-forms',
                        name: 'AdminDefaultForms',
                        meta: {middleware: [isAuthorized, hasAppData, hasRole]},
                        component: () => import('./components/admin/AdminDefaultForms.vue'),
                    },
                    {
                        path: 'default-tag-blocks',
                        name: 'AdminDefaultTagBlocks',
                        meta: {middleware: [isAuthorized, hasAppData, hasRole]},
                        component: () => import('./components/admin/AdminDefaultTagBlocks.vue'),
                    },
                ]
            },
            {
                path: '*',
                name: 'Dashboard404',
                component: () => import('./views/page404.vue')
            },
        ]
    },
    {
        path: '*',
        name: '404',
        component: () => import('./views/page404.vue')
    },
];

const router = new VueRouter({
    mode: 'history',
    base: import.meta.env.BASE_URL,
    routes,
    scrollBehavior(to) {
        if (!to.query.skip) return {x: 0, y: 0}
    }
});

function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    if (!subsequentMiddleware) return context.next;

    return (...parameters) => {
        context.next(...parameters);
        const nextMiddleware = nextFactory(context, middleware, index + 1);
        subsequentMiddleware({...context, next: nextMiddleware});
    };
}

router.beforeResolve((to, from, next) => {
    if (to.name) {
        store.commit('mutatePreloader', true);
    }
    next()
})

router.afterEach((to, from) => {
    store.commit('mutatePreloader', false);
})

router.onError((error, to) => {
    if (error.message.includes('Failed to fetch dynamically imported module') || error.message.includes("Importing a module script failed")) {
        if (to) window.location = to.fullPath
        else window.location = window.location
    }
})

router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
        const middleware = Array.isArray(to.meta.middleware)
            ? to.meta.middleware
            : [to.meta.middleware];

        const context = {from, next, router, to};
        const nextMiddleware = nextFactory(context, middleware, 1);
        return middleware[0]({...context, next: nextMiddleware});
    }

    return next();
});

export default router;
