<template>
    <div class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800">
        <div class="flex flex-col flex-grow items-center justify-center w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
            <!-- begin:: body -->
            <h1 class="text-4xl font-bold text-gray-800 px-4 pb-5">Welcome to My Social Media</h1>
            <p class="text-gray-500">This is a My Social Media Network</p>
            <p class="text-gray-500">Login to continue</p>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5" @click="handleLogin">Login</button>
            <!-- end:: body -->
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
                this.uid = result.user.uid;
                this.user = result.user.displayName;
                this.email = result.user.email;
                this.photoURL = result.user.photoURL;
                this.isLogin = true

                let data = {
                    uid: this.uid,
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