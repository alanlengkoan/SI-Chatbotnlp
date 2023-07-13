<template>
    <div class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800">
        <!-- begin:: chat template -->
        <div class="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
            <div class="relative flex items-center p-3 border-b border-gray-300">
                <img class="object-cover w-10 h-10 rounded-full"
                    src="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg" alt="username" />
                <span class="block ml-2 font-bold text-gray-600">Alan Lengkoan</span>
                <span class="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3">
                </span>
            </div>
            <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
                <ul class="space-y-2">
                    <li class="flex justify-start">
                        <div class="relative max-w-xl px-4 py-2 text-gray-700 rounded shadow">
                            <span class="block">Hi, Alan Lengkoan</span>
                        </div>
                    </li>
                    <li v-bind:class="(row.type === 'user' ? 'flex justify-end' : 'flex justify-start')" v-for="row in chat"
                        :key="row.id">
                        <div
                            v-bind:class="(row.type === 'user' ? 'relative max-w-xl px-4 py-2 text-gray-700 rounded shadow' : 'relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow')">
                            <span class="block">{{ (row.type === 'user' ? row.query : row.message) }}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="relative flex items-center justify-between w-full p-3 border-t border-gray-300">
                <input type="text"
                    class="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
                    ref="query" :placeholder="query" required />
                <button type="submit" @click="postChat">
                    <svg class="w-5 h-5 text-gray-500 origin-center transform rotate-90" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20" fill="currentColor">
                        <path
                            d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </div>
        </div>
        <!-- end:: chat template -->
    </div>
</template>

<script>
import http from '../axios';

export default {
    name: 'Chat',
    data() {
        return {
            query: 'Message',
            chat: []
        }
    },
    methods: {
        async getChat() {
            try {
                http.get('/dialogflow/chat').then((response) => {
                    this.chat = response.data.data;
                });
            } catch (error) {
                console.log(error);
            }
        },
        async postChat() {
            try {
                const query = this.$refs.query.value;
                const data = {
                    id_account: "-",
                    type: "user",
                    query: query,
                    message: "-",
                    date: new Date()
                }

                await http.post('/dialogflow/detect', data);

                this.$refs.query.value = '';
                this.getChat();
            } catch (error) {
                console.log(error);
            }
        }
    },
    mounted() {
        this.getChat();
    }
}
</script>