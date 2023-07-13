<template>
    <div>
        <p class="text-gray-500">Welcome, {{ nama }}</p>
        <p class="text-gray-500">Email: {{ email }}</p>
        <img :src="photoURL" alt="photo" class="w-20 h-20 rounded-full object-cover mt-2">

        <button @click="handleLogout"
            class="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600">Logout</button>
    </div>

    <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-4">Chat with Friend</h1>

            <div class="flex flex-col h-80">
                <div class="flex-1 overflow-y-auto bg-gray-100 p-4 rounded-lg shadow-md">
                    <!-- Chat messages -->
                    <div class="flex flex-col space-y-2">
                        <div class="flex">
                            <div class="rounded-full bg-blue-500 h-8 w-8 flex items-center justify-center text-white mr-2">
                                <span>Me</span>
                            </div>
                            <div class="bg-blue-200 text-gray-700 rounded-lg py-2 px-4">
                                <p>Hello!</p>
                                <p>How are you?</p>
                            </div>
                        </div>
                        <div class="flex flex-row-reverse">
                            <div
                                class="rounded-full bg-purple-500 h-8 w-8 flex items-center justify-center text-white ml-2">
                                <span>Friend</span>
                            </div>
                            <div class="bg-purple-200 text-gray-700 rounded-lg py-2 px-4">
                                <p>Hi!</p>
                                <p>I'm good, thanks. How about you?</p>
                            </div>
                        </div>
                        <!-- Repeat the chat messages for each conversation -->
                    </div>
                </div>

                <div class="mt-4">
                    <form>
                        <div class="flex">
                            <input type="text"
                                class="flex-1 rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none"
                                placeholder="Type your message...">
                            <button type="submit"
                                class="bg-blue-500 hover:bg-blue-600 rounded-r-lg px-4 py-2 text-white">Send</button>
                        </div>
                    </form>
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
    data() {
        return {
            nama: '',
            email: '',
            photoURL: '',
        }
    },
    methods: {
        loadUser() {
            let user = JSON.parse(localStorage.getItem('user'));

            this.nama = user.name;
            this.email = user.email;
            this.photoURL = user.photo;
        },
        handleLogout() {
            signOut(auth).then(() => {
                // Sign-out successful.
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
        }
    },
    mounted() {
        this.loadUser();
    }
}
</script>