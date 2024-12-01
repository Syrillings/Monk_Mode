<script setup>
import { defineProps, ref, onMounted, onUnmounted } from 'vue';

const title = ref('');
const author = ref('');
const error = ref(null);

const fetchQuote = async () => {
  try {
    const response = await fetch('/quotes.json'); 
    const data = await response.json();

  
    const randomQuote = data[Math.floor(Math.random() * data.length)];
    title.value = randomQuote.quote; // Assuming "text" is the property for quote content
    author.value = randomQuote.author; // Assuming "author" is the property for author name

    console.log('Fetched quote:', title.value, author.value);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    error.value = 'Error fetching quotes';
  }
};

onMounted(() => {
  fetchQuote();
  const intervalId = setInterval(fetchQuote, 30000); 
  onUnmounted(() => clearInterval(intervalId));
});
</script>

<template>
  <div>
    <section class="bg-bine p-[50px] mt-5 text-center rounded-[20px]">
      <h2 class="text-3xl font-medium font-playfair mb-4">"{{ title }} "</h2>
      <p class="text-md font-georgia text-black">- {{ author }} -</p>
      <p v-if="error">Error fetching quote: {{ error }}</p>
    </section>
  </div>
</template>