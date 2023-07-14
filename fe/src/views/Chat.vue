<!-- untuk tampilan daftar pesan -->
<script setup>
import Navbar from '../components/Navbar.vue';
import ChatList from '../components/ChatList.vue';
</script>

<template>
    <div class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800">
        <div class="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
            <!-- begin:: navbar -->
            <Navbar :uid="uid" :nama="nama" :photoURL="photoURL" :email="email" />
            <!-- end:: navbar -->

            <!-- begin:: chat template -->
            <ChatList />
            <!-- end:: chat template -->
        </div>
    </div>
</template>


<script>
import firebase from "../firebase";
import {
    getAuth,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    collection,
    orderBy,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query
} from "firebase/firestore";
import { ref, onUnmounted, nextTick } from 'vue';

firebase
const auth = getAuth();
const db = getFirestore(firebase);

export default {
    name: 'ChatRoom',
    data() {
        return {
            show: false,
            message: 'Message',
            messages: ref([]),
            uid: '',
            nama: '',
            email: '',
            photoURL: '',
        }
    },
    methods: {
        loadUser() {
            let user = JSON.parse(localStorage.getItem('user'));

            this.uid = user.uid;
            this.nama = user.name;
            this.email = user.email;
            this.photoURL = user.photo;
        },
    },
    mounted() {
        this.loadUser();
    }
}
</script>