<template>
    <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
        <ul class="space-y-2" ref="messagges">
            <li v-bind:class="(row.uid === this.uid ? 'flex justify-end' : 'flex justify-start')"
                v-for="row in messages" :key="row.id">
                <div
                    v-bind:class="(row.uid === this.uid ? 'relative max-w-xl px-4 py-2 text-gray-700 rounded shadow' : 'relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow')">
                    <span class="block">{{ row.message }}</span>
                    <p class="text-xs text-right text-gray-400">{{ convertDate(row.created_at) }}</p>
                </div>
            </li>
            <div ref="bottom"></div>
        </ul>
    </div>
    <div class="relative flex items-center justify-between w-full p-3 border-t border-gray-300">
        <input type="text" class="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700" ref="message"  @keypress.enter="sendMesagge" :placeholder="message" required />
        <button type="submit" @click="sendMesagge">
            <font-awesome-icon icon="fa-solid fa-paper-plane" />
        </button>
    </div>
</template>

<script>
import firebase from "../firebase";
import {
    getFirestore,
    collection,
    orderBy,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query
} from "firebase/firestore";
import {ref, onUnmounted, nextTick} from 'vue';

firebase
const db = getFirestore(firebase);

export default {
    name: 'ChatRoom',
    data() {
        return {
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
        loadChat() {
            try {
                const qryMessages = query(collection(db, "Messages"), orderBy('created_at', 'asc'));
                const unsubscribe = onSnapshot(qryMessages, (querySnapshot) => {
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
    },
    mounted() {
        this.loadUser();
        this.loadChat();
    }
}
</script>