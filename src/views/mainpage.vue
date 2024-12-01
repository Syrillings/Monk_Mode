<script setup>
import logo6 from '/src/assets/Images/user.png'
import { ref, onMounted } from 'vue';
import { auth, onAuthStateChanged } from '../firebase';  // Make sure the path is correct
import logo8 from '/src/assets/Images/newmonk.png'
import inspiration from '@/components/inspiration.vue';
import navbar from '@/components/navbar.vue';
import Footer from '@/components/footer.vue';
import stats from '@/components/stats.vue';
import calendar from '@/components/calendar.vue';
import goalcard from '@/components/goalcard.vue';

const userDisplayName = ref('');

onMounted(() => {
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      userDisplayName.value = firebaseUser.displayName ;
    }
  });
});
</script>

<template>
<div class=" bg-mine text-white-600  pt-10 lg:pl-18">
  
   
  <navbar/>
   
  <inspiration/>
  
 <goalcard/>

    </div>
<stats/>

<Footer />

    
  </template>

       
      
       


