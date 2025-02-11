<script setup>
import { ref } from 'vue';
import User from '/src/assets/Images/duser.png';
import Target from '/src/assets/Images/clipboard.png';
import Home from '/src/assets/Images/home.png';
import { useRouter } from 'vue-router';

const isAnimating = ref(false);
const router = useRouter();

const animateButton = (event, path) => {
  const button = event.currentTarget;
  button.classList.add('animate');
  setTimeout(() => {
   
    button.classList.remove('animate');
    router.push(path);
  }, 100); 
};
</script>

<template>
  <footer class="fixed bottom-0 left-0 right-0 bg-[#A53396] p-[-1] shadow-lg">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-around items-center">
        <!-- Home Icon -->
        <button
          @click="event => animateButton(event, '/main')"
          class="flex flex-col items-center text-white hover:text-gray-400 transition-colors duration-400"
        >
          <img
            :src="Home"
            class="w-[40px] h-[40px]"
            alt="Goals"
          />
        </button>

        <!-- Goals Icon -->
        <button
          @click="event => animateButton(event, '/main/goals')"
          class="flex flex-col items-center text-white hover:text-gray-400 transition-colors duration-400"
        >
          <img
            :src="Target"
            class="w-[40px] h-[40px]"
            alt="Target"
          />
        </button>

        <!-- User Profile Icon -->
        <button
          @click="event => animateButton(event, '/user')"
          class="flex flex-col items-center text-white hover:text-gray-400 transition-colors duration-400"
        >
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
@keyframes grow {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

.animate {
  animation: grow 0.5s ease-in-out;
}

.parent-container {
  background-color: #EAC4D5;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-container {
  flex: 1;
  overflow-y: auto;
}

footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>