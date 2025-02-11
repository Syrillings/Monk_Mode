<script setup>
import { ref, onMounted, watch } from 'vue';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { state } from '../state';

const db = getFirestore();

const goalsSet = ref(0);
const goalsCompleted = ref(0);
const progress = ref(0);

const fetchStats = async () => {
  const querySnapshot = await getDocs(collection(db, 'users', 'user_id', 'tasks'));
  const tasks = querySnapshot.docs.map(doc => doc.data());

  goalsSet.value = tasks.length;
  goalsCompleted.value = tasks.filter(task => task.done).length;
  progress.value = goalsSet.value ? Math.floor((goalsCompleted.value / goalsSet.value) * 100) : 0;
};

const updateStats = () => {
  goalsSet.value = state.tasks.length;
  goalsCompleted.value = state.tasks.filter(task => task.done).length;
  progress.value = goalsSet.value ? Math.floor((goalsCompleted.value / goalsSet.value) * 100) : 0;
};

onMounted(() => {
  fetchStats();
  watch(() => state.tasks, updateStats, { deep: true });
});
</script>

<template>
<section class="p-6 bg-rine rounded-xl">
    <h3 class="text-2xl font-bold mb-4">Stats</h3>
    <div class="flex justify-around">
        <div class="text-center">
            <h4 class="text-3xl font-bold">{{ goalsSet }}</h4>
            <p>Goals Set</p>
        </div>
        <div class="text-center">
            <h4 class="text-3xl font-bold">{{ goalsCompleted }}</h4>
            <p>Completed</p>
        </div>
        <div class="text-center">
            <h4 class="text-3xl font-bold">{{ progress }}%</h4>
            <p>Progress</p>
        </div>
    </div>
</section>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>