<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import logo from '/src/assets/Images/newmonk.png'

const router = useRouter();
onMounted(() => {

  setTimeout(() => {
    router.push('/signup'); 
  }, 1500);
});
</script>

<template>
    <div class="h-screen bg-mine flex items-center justify-center pb-20">
  <div class="text-center">
    
    <img v-bind:src="logo" alt="Monk Logo" class="w-32 mx-auto mb-5">
    <h1 class="font-josefin text-4xl text-black">Monk Mode</h1>
    <p class=" font-italianno text-2xl text-black  mt-2">Your Path, Our Guidance...</p>
   


</div>
</div>
</template>

