<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Chat List - Friends</h1>

        <ul class="space-y-4">
            <!-- Friend Chat Card Start -->
            <li class="bg-white rounded-lg shadow-md p-4">
                <div class="flex items-center mb-2">
                    <img class="h-10 w-10 rounded-full object-cover mr-2" src="friend1.jpg" alt="Friend 1">
                    <div>
                        <h2 class="font-bold text-lg">Friend 1</h2>
                        <p class="text-gray-500">Last message from Friend 1</p>
                    </div>
                </div>
                <p class="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in tristique
                    arcu. Quisque lacinia, massa vitae congue gravida, neque metus tincidunt tellus, non congue nisl
                    ipsum at neque.</p>
            </li>
            <!-- Friend Chat Card End -->

            <!-- Repeat the friend chat card for each friend in the list -->
            <!-- Friend Chat Card Start -->
            <li class="bg-white rounded-lg shadow-md p-4">
                <div class="flex items-center mb-2">
                    <img class="h-10 w-10 rounded-full object-cover mr-2" src="friend2.jpg" alt="Friend 2">
                    <div>
                        <h2 class="font-bold text-lg">Friend 2</h2>
                        <p class="text-gray-500">Last message from Friend 2</p>
                    </div>
                </div>
                <p class="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in tristique
                    arcu. Quisque lacinia, massa vitae congue gravida, neque metus tincidunt tellus, non congue nisl
                    ipsum at neque.</p>
            </li>
            <!-- Friend Chat Card End -->

            <!-- Repeat the friend chat card for each friend in the list -->
            <!-- Friend Chat Card Start -->
            <li class="bg-white rounded-lg shadow-md p-4">
                <div class="flex items-center mb-2">
                    <img class="h-10 w-10 rounded-full object-cover mr-2" src="friend3.jpg" alt="Friend 3">
                    <div>
                        <h2 class="font-bold text-lg">Friend 3</h2>
                        <p class="text-gray-500">Last message from Friend 3</p>
                    </div>
                </div>
                <p class="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in tristique
                    arcu. Quisque lacinia, massa vitae congue gravida, neque metus tincidunt tellus, non congue nisl
                    ipsum at neque.</p>
            </li>
            <!-- Friend Chat Card End -->

            <!-- Repeat the friend chat card for each friend in the list -->

        </ul>
    </div>
</template>

<script>
export default {
    name: 'ChatList',
    data() {
        return {

        }
    },
    methods: {
    },
    mounted() {
    }
}
</script>