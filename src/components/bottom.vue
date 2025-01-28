<script setup>
import User from '/src/assets/Images/duser.png';
import Target from '/src/assets/Images/clipboard.png';
import Home from '/src/assets/Images/home.png'
</script>

<template>
  <footer class="fixed bottom-0 left-0 right-0 bg-[#A53396] p-3 shadow-lg">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-around items-center">
        <!-- Home Icon -->
        <button class="flex flex-col items-center text-white hover:text-gray-400 transition-colors duration-400">
          <img
        :src="Home"
        class="w-[40px] h-[40px] "
        alt="Goals"
        />
        </button>

        <!-- Goals Icon -->
        <button class="flex flex-col items-center text-white hover:text-gray-400 transition-colors duration-400">
          <img
        :src="Target"
        class="w-[40px] h-[40px] "
        alt="Target"
          />
        </button>

        <!-- User Profile Icon -->
        <button class="flex flex-col items-center text-white hover:text-gray-400 transition-colors duration-400">
          <img
        :src="User"
        class="w-[40px] h-[40px]"
        alt="User"
          />
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
}
</style>
