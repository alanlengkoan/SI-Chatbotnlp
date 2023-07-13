import {
    createRouter,
    createWebHistory
} from 'vue-router'
import WelcomeVue from '../components/Welcome.vue'
import ChatRoomVue from '../components/ChatRoom.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [{
            path: '/',
            name: 'welcome',
            component: WelcomeVue
        },
        {
            path: '/chat-room',
            name: 'chatroom',
            component: ChatRoomVue,
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
            name: 'chatroom'
        });
    } else {
        next();
    }
});

export default router