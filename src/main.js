import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';


import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from './firebase'; // Ensure the path to your firebaseConfig is correct


initializeApp(firebaseConfig);


const auth = getAuth();


const app = createApp(App);


const pinia = createPinia();
app.use(router);
app.use(pinia);


onAuthStateChanged(auth, () => {
  app.mount('#app');
});