<template>
    <div class="relative flex justify-between p-3 border-b border-gray-300">
        <div class="flex items-center">
            <img class="object-cover w-10 h-10 rounded-full" :src="photoURL" :alt="nama" />
            <span class="block ml-2 font-bold text-gray-600">{{ nama }}</span>
            <span class="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
        </div>
        <div class="relative">
            <button @click="show = !show" class="items-center p-2">
                <font-awesome-icon icon="fa-solid fa-bars" />
            </button>
            <div v-show="show" class="absolute right-0 py-2 mt-2 bg-white rounded-md shadow-xl w-44">
                <router-link to="/profil"  class="block px-4 py-2 text-sm text-gray-800 hover:text-gray-400">Profil</router-link>
                <button @click="handleLogout" class="block px-4 py-2 text-sm text-gray-800 hover:text-gray-400">Logout</button>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from "../firebase";
import {
    getAuth,
    signOut,
} from "firebase/auth";

firebase
const auth = getAuth();

export default {
    name: 'ChatRoom',
    props: {
        uid: {
            type: String,
            required: true,
            default: ''
        },
        nama: {
            type: String,
            required: true,
            default: ''
        },
        photoURL: {
            type: String,
            required: true,
            default: ''
        },
        email: {
            type: String,
            required: true,
            default: ''
        },
    },
    data() {
        return {
            show: false,
        }
    },
    methods: {
        handleLogout() {
            signOut(auth).then(() => {
                localStorage.setItem('authenticated', false);
                localStorage.removeItem('user');
                this.$router.push({
                    name: 'welcome'
                });
            }).catch((error) => {
                console.log(error);
            });
        },
    },
    mounted() {

    }
}
</script>