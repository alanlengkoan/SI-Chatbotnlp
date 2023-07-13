<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <div class="flex flex-col items-center justify-center">
            <h1 class="text-4xl font-bold text-gray-800 px-4 pb-5">Welcome to My Social Media</h1>
            <p class="text-gray-500">This is a My Social Media Network</p>

            <p class="text-gray-500">Login to continue</p>
            <button @click="handleLogin" class="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600">Login</button>
        </div>
    </div>
</template>

<script>
import firebase from "../firebase";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc,
} from "firebase/firestore";

firebase
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export default {
    name: 'Welcome',
    data() {
        return {
        }
    },
    methods: {
        handleLogin () {
            signInWithPopup(auth, provider).then(async (result) => {
                // The signed-in user info.
                this.user = result.user.displayName;
                this.email = result.user.email;
                this.photoURL = result.user.photoURL;
                this.isLogin = true

                let data = {
                    name: this.user,
                    email: this.email,
                    photo: this.photoURL,
                }

                // untuk simpan data ke firebase
                const docRef = await addDoc(collection(db, "Users"), data);
                console.log('Create data users berhasil ' + docRef.id);

                // untuk set local storage
                localStorage.setItem('authenticated', true);
                localStorage.setItem('user', JSON.stringify(data));
                this.$router.push({
                    name: 'chatroom'
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