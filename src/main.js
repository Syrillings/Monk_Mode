import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from './firebase';

initializeApp(firebaseConfig);
const auth = getAuth();

const app = createApp(App);
app.use(router);
app.use(createPinia());

app.mount('#app');


onAuthStateChanged(auth, (user) => {
  console.log("User state changed:", user);
});
