<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
//import ProfilePic from '/src/assets/profile-pic.png'; // Replace with actual image
import { Pencil, Key, Info, RefreshCcw, LogOut } from 'lucide-vue-next';

const router = useRouter();

const menuItems = [
  { name: 'Edit Profile', icon: Pencil,  },
  { name: 'Change Password', icon: Key,  },
  { name: 'Information', icon: Info,  },
  { name: 'Update', icon: RefreshCcw, },
  { name: 'Log out', icon: LogOut,  },
];

const navigate = (path) => {
  router.push(path);
};
</script>

<template>
  <aside class="w-64 bg-purple-700 text-white h-screen p-6 flex flex-col items-center rounded-r-2xl shadow-lg">
    <!-- Profile Picture -->
    <div class="relative">
      <img :src="ProfilePic" class="w-24 h-24 rounded-full border-4 border-white shadow-md" alt="Profile" />
      <button class="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md">
        <Pencil class="w-5 h-5 text-purple-700" />
      </button>
    </div>

    <!-- User Info -->
    <h2 class="mt-4 font-semibold text-lg">Sofronova Alla</h2>
    <span class="bg-purple-500 text-sm px-3 py-1 rounded-full mt-1">345 Баллов</span>

    <!-- Sidebar Menu -->
    <nav class="mt-6 w-full">
      <ul class="space-y-4">
        <li
          v-for="item in menuItems"
          :key="item.name"
          @click="navigate(item.path)"
          class="flex items-center gap-3 p-3 hover:bg-purple-800 rounded-lg cursor-pointer transition"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="text-sm font-medium">{{ item.name }}</span>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
/* Custom styling can be added if needed */
</style>
