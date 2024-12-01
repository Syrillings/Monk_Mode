<script setup>
import { ref, onMounted } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref as dbRef, set } from 'firebase/database';

const highlightedDays = ref([])  ;

function highlightUserUsage() {
  const usageDates = JSON.parse(localStorage.getItem('appUsageDates')) || [];
  const today = new Date().toISOString().split('T')[0];

  // Map each date to a format for Vue Cal
  highlightedDays.value = usageDates.map(date => ({
    start: new Date(date),
    end: new Date(date),
    title: '',
    customClass: date === today ? 'current-day' : 'streak-day', // Gray for today, purple for streaks
  }));
}

onMounted(() => {
  const today = new Date().toISOString().split('T')[0];

  // Retrieve saved usage dates from localStorage
  let usageDates = JSON.parse(localStorage.getItem('appUsageDates')) || [];

  // If today is not already in the saved dates, add it
  if (!usageDates.includes(today)) {
    usageDates.push(today);
    localStorage.setItem('appUsageDates', JSON.stringify(usageDates));
  }

  // Save usage dates to Firebase under the user's record, if authenticated
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  if (userId) {
    const db = getDatabase();
    set(dbRef(db, `users/${userId}/appUsageDates`), usageDates);
  }

  // Highlight the usage days
  highlightUserUsage();
});
</script>

<template>
  <div>
    <div class="app-calendar">
      <vue-cal
        :events="highlightedDays"
        :views="['day']"
        default-view="day"
        hide-view-selector
        class="my-custom-calendar"
        event-slot-class="custom-event"
      />
    </div>
  </div>
</template>

<style>
.my-custom-calendar .streak-day {
  background-color: #9B127F !important; /* Purple for streak days */
  color: white; /* Text color for contrast */
}

.my-custom-calendar .current-day {
  background-color: gray !important; /* Gray for today */
  color: white; /* Text color for contrast */
}

.my-custom-calendar .vuecal__cell {
  height: 2.5rem; /* Compact height */
  width: 2.5rem; /* Compact width for circular cells */
  border-radius: 0%; /* Make the cells circular */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #111010; /* Optional border */
}

.my-custom-calendar .vuecal__cell.is-today {
  background-color: transparent !important; /* Remove default styling for today's date */
}
</style>
