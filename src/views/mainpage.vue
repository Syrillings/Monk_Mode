<script setup>
import logo6 from '/src/assets/Images/user.png';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { auth, onAuthStateChanged } from '../firebase';  // Make sure the path is correct
import logo8 from '/src/assets/Images/newmonk.png'
import inspiration from '@/components/inspiration.vue';
import navbar from '@/components/navbar.vue';
import Bottom from '@/components/bottom.vue'
import stats from '@/components/stats.vue';
import calendar from '@/components/calendar.vue';
import goalcard from '@/components/goalcard.vue';

const userDisplayName = ref('');

const router = useRouter();

onMounted(() => {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      userDisplayName.value = firebaseUser.displayName || firebaseUser.email || 'Anonymous';
    } else {
      router.push('/signup'); 
    }
  });
})
</script>

<template>
<div class=" bg-mine text-white-600  pt-10 lg:pl-18">
<navbar/> 
<inspiration/>
<goalcard/>
</div>
<stats/>
  <Bottom/>
  </template>

       
      
       


