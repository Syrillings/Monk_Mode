<template>
    <div class="flex flex-col h-screen bg-bine">
      <!-- Chat Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- User's Input -->
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            'p-4 max-w-xs rounded-lg',
            message.sender === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200 text-black mr-auto'
          ]"
        >
          <p>{{ message.text }}</p>
          <!-- If AI-generated task, show allocated time -->
          <p v-if="message.time" class="text-sm text-gray-500 mt-2">Time: {{ message.time }} hours</p>
        </div>
      </div>
  
      <!-- Input Field -->
      <div class="p-4 bg-tine border-t">
        <form @submit.prevent="handleMessage">
          <div class="flex">
            <input
              v-model="userInput"
              type="text"
              placeholder="Describe how you want your day to go..."
              class="flex-1 p-2 border rounded-lg"
            />
            <button
              type="submit"
              class="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { auth, onAuthStateChanged } from '../firebase';

  const userDisplayName = ref('');
  const messages = ref([
    { sender: 'bot', text: `Hi, ${userDisplayName.value}! Describe how you want your day to go, and I’ll create a to-do list for you.` }
  ]);

  onMounted(() => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const displayName = firebaseUser.displayName;
        const firstName = displayName.split(' ')[0];
        userDisplayName.value = firstName;
        }
    });
  });




  
  // User input
  const userInput = ref('');
  
  // Handle sending a message
  const handleMessage = async () => {
    if (!userInput.value.trim()) return;
  
    // Add user's message to chat
    messages.value.push({ sender: 'user', text: userInput.value });
  
    // Simulate AI response
    const tasks = await generateTasks(userInput.value); // Replace with TensorFlow.js AI function
  
    // Add AI-generated tasks to chat
    tasks.forEach(task => {
      messages.value.push({
        sender: 'bot',
        text: task.task,
        time: task.time
      });
    });
  
    // Clear input
    userInput.value = '';
  };
  
  // Simulated AI task generator (replace this with your AI model)
  const generateTasks = async (description) => {
    return [
      { task: 'Morning workout', time: 1 },
      { task: 'Read a book', time: 2 },
      { task: 'Meditation', time: 0.5 }
    ]; // Mock data
  };
  </script>
  
 
  