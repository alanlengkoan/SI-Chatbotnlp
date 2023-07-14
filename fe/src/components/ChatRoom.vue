<template>
    <div class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800">
        <div class="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
            <!-- begin:: chat template -->
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
                        <button @click="handleLogout" class="block px-4 py-2 text-sm text-gray-800 hover:text-gray-400">Logout</button>
                    </div>
                </div>
            </div>
            <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
                <ul class="space-y-2" ref="messagges">
                    <li v-bind:class="(row.uid === this.uid ? 'flex justify-end' : 'flex justify-start')" v-for="row in messages" :key="row.id">
                        <div v-bind:class="(row.uid === this.uid ? 'relative max-w-xl px-4 py-2 text-gray-700 rounded shadow' : 'relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow')">
                            <span class="block">{{ row.message }}</span>
                            <p class="text-xs text-right text-gray-400">{{ convertDate(row.created_at) }}</p>
                        </div>
                    </li>
                    <div ref="bottom"></div>
                </ul>
            </div>
            <div class="relative flex items-center justify-between w-full p-3 border-t border-gray-300">
                <input type="text" @keypress.enter="sendMesagge" class="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700" ref="message" :placeholder="message" required />
                <button type="submit" @click="sendMesagge">
                  <font-awesome-icon icon="fa-solid fa-paper-plane" />
                </button>
            </div>
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
import {ref, onUnmounted, nextTick, watch} from 'vue';

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
        handleLogout() {
            signOut(auth).then(() => {
                // Sign-out successful.
                this.uid = '';
                this.user = '';
                this.email = '';
                this.photoURL = '';

                localStorage.setItem('authenticated', false);
                localStorage.removeItem('user');
                this.$router.push({
                    name: 'welcome'
                });
            }).catch((error) => {
                console.log(error);
            });
        },
        convertDate(date) {
            if (date === null) {
                return '';
            } else {
                let convertDate = date.toDate();
                let d = new Date(convertDate);
                let hours = d.getHours();
                let minutes = d.getMinutes();
                let seconds = d.getSeconds();
                let ampm = hours >= 12 ? 'PM' : 'AM';
                let strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
                return strTime;
            }
        },
        getChat() {
            try {
                const q = query(collection(db, "Messages"), orderBy('created_at', 'asc'));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                   this.messages = querySnapshot.docs.map((doc) => ({
                       id: doc.id,
                       ...doc.data()
                   }));

                   
                    nextTick(() => {
                        this.$refs.bottom?.scrollIntoView({ behavior: 'smooth' });
                    });
                });

                onUnmounted(unsubscribe);
            } catch (error) {
                console.log(error);
            }
        },
        sendMesagge() {
            try {
                if (this.$refs.message.value === '') {
                    return;
                }

                const table = collection(db, "Messages");

                const data = {
                    uid: this.uid,
                    nama: this.nama,
                    email: this.email,
                    photo: this.photoURL,
                    message: this.$refs.message.value,
                    created_at: serverTimestamp()
                }

                addDoc(table, data).then((docRef) => {
                    console.log('Create data messages berhasil ' + docRef.id);
                }).catch((error) => {
                    console.log(error);
                });

                this.$refs.bottom?.scrollIntoView({ behavior: 'smooth' });
                this.$refs.message.value = '';
            } catch (error) {
                console.log(error);
            }
        }
    },
    mounted() {
        this.loadUser();
        this.getChat();
    }
}
</script>