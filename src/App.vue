<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { LocalNotifications } from '@capacitor/local-notifications';

const requestNotificationPermission = async () => {
  const permStatus = await LocalNotifications.requestPermissions();
  console.log('🔔 Notification Permission:', permStatus);

  if (permStatus.display === 'granted') {
    await LocalNotifications.createChannel({
      id: 'high_importance_channel',
      name: 'High Importance Notifications',
      importance: 5, 
      description: 'High priority task notifications',
      sound: 'default',
      visibility: 'public',
      vibration: true,
    });
    console.log('✅ High-priority notification channel created.');
  }
};

onMounted(() => {
  requestNotificationPermission();
});
</script>

<template>
  <header>
    <div>
      <RouterLink to="/"></RouterLink>
      <RouterLink to="/signup"></RouterLink>
      <RouterLink to="/main"></RouterLink>
      <RouterLink to="/createaccount"></RouterLink>
    </div>
  </header>

  <RouterView />
</template>




