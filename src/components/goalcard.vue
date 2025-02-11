<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { state } from '../state';

const firstNonGreyedOutTask = computed(() => state.tasks.find(task => !task.isFading)); // Get the first non-greyed-out task

const updateElapsedTimes = () => {
  state.tasks = state.tasks.map((task) => {
    if (task.isFrozen) {
      return task;
    }

    const elapsedTime = calculateElapsedTime(task.startTime, task.endTime);
    if (elapsedTime >= 100) {
      task.isFading = true;
      task.hideCheckbox = true;
    }
    return {
      ...task,
      elapsedTime,
    };
  });
};


const calculateElapsedTime = (startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now < start) {
    return 0;
  } else if (now > end) {
    return 100;
  } else {
    const totalTime = end - start;
    const elapsedTime = now - start;
    return Math.round((elapsedTime / totalTime) * 100);
  }
};

onMounted(() => {
  const interval = setInterval(updateElapsedTimes, 1000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<template>
  <section class="p-9">
    <h3 class="text-2xl font-semibold mb-4">Your Itinerary</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  
      <div v-if="firstNonGreyedOutTask" class="bg-white p-4 rounded-lg shadow-md">
        <h4 class="font-semibold text-lg">{{ firstNonGreyedOutTask.name }}</h4>
        <p class="font-bold text-tine">
  Allotted Time: 
  {{ new Date(firstNonGreyedOutTask.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }} - 
  {{ new Date(firstNonGreyedOutTask.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) }}
</p>
        <p>Elapsed Time: {{ firstNonGreyedOutTask.elapsedTime.toFixed(0) }}%</p>
        <div class="bg-gray-300 w-full rounded-full h-4 mt-2">
          <div class="bg-tine h-4 rounded-full" :style="{ width: firstNonGreyedOutTask.elapsedTime + '%' }"></div>
        </div>
      </div>
      <div v-else class="bg-white p-4 rounded-lg shadow-md">
        <p>No tasks available</p>
      </div>
    </div>
    <RouterLink to="main/goals">      
    <button class="bg-tine text-white py-2 px-4 mt-4 rounded-lg">View All Tasks</button>
    </RouterLink>
  </section>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>