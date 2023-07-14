import {
    createRouter,
    createWebHistory
} from 'vue-router'
import WelcomeView from '../views/Welcome.vue'
import ChatView from '../views/Chat.vue'
import ProfilView from '../views/Profil.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/welcome',
            name: 'welcome',
            component: WelcomeView
        },
        {
            path: '/',
            name: 'home',
            component: ChatView
        },
        {
            path: '/profil',
            name: 'profil',
            component: ProfilView
        },
    ]
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = JSON.parse(localStorage.getItem('authenticated'));

    // untuk block halaman
    if (to.name !== 'welcome' && !isAuthenticated) {
        next({
            name: 'welcome'
        });
    } else if (to.name === 'welcome' && isAuthenticated) {
        next({
            name: 'home'
        });
    } else {
        next();
    }
});

export default router