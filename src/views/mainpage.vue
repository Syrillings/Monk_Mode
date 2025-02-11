<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { auth, onAuthStateChanged } from '../firebase';  // Make sure the path is correct
import inspiration from '@/components/inspiration.vue';
import navbar from '@/components/navbar.vue';
import Bottom from '@/components/bottom.vue';
import stats from '@/components/stats.vue';
import goalcard from '@/components/goalcard.vue';

const userDisplayName = ref('');
const router = useRouter();
const key = ref(0); 
onMounted(() => {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      userDisplayName.value = firebaseUser.displayName || firebaseUser.email || 'Anonymous';
      key.value++; 
    } else {
      router.push('/signup'); 
    }
  });
});
</script>

<template>
  <div :key="key" class="container bg-mine text-white-600 pt-10 lg:pl-18">
    <navbar />
    <div class="content">
      <div class="scrollable-content">
        <inspiration />
        <goalcard />
        <stats />
      </div>
    </div>
    <Bottom />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.scrollable-content {
  flex: 1;
  min-height: 0; 
  overflow-y: auto; 
  padding: 1rem; 
  box-sizing: border-box;
}

.bg-mine {
  background-color: #EAC4D5;
}
</style>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
}

navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #EAC4D5;
}

.scrollable-content {
  flex: 1;
  min-height: 0; 
  overflow-y: auto; 
  padding-top: 0.5rem;
  padding-bottom: 5rem; 
  scroll-behavior: smooth;
}

.stats-container {
  padding-bottom: 5rem; 
}

.bg-mine {
  background-color: #EAC4D5;
}
</style>