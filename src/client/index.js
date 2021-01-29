import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';


//////////////////////////////////////////////////
//  GLOBAL
//////////////////////////////////////////////////


window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();

    // Defer install prompt.
    setTimeout(() => e.prompt(), 15000);
});

window.addEventListener('error', err => {
    alert(err.message);
});


//////////////////////////////////////////////////
//  PAGES
//////////////////////////////////////////////////


import App from '@/pages/app';
import Home from '@/pages/home';


//////////////////////////////////////////////////
//  ROUTER
//////////////////////////////////////////////////


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
});


//////////////////////////////////////////////////
//  INSTANCE
//////////////////////////////////////////////////


const app = createApp(App).use(router);

router.isReady().then(() => {
    app.mount('body');
});