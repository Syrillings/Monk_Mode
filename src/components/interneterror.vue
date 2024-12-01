<script setup>
import l1 from '/src/assets/Images/complain.png'
</script>
<template >
  <div class="h-screen bg-mine flex items-center justify-center pb-20">
    <div class="text-center">
    
    <img v-bind:src="l1"  class="w-[32] mx-auto mb-5">
    <h1 class="font-josefin text-4xl text-gray-800">Looks Like you aren't plugged in🥲</h1>
    <p class="  text-lg text-red-600  mt-2">Check your Internet Connection</p>
    </div>
    </div>
</template>