<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Navbar from '@/components/navbar2.vue';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

const newTask = ref('');
const startTime = ref('');
const endTime = ref('');
const tasks = ref([]);

const addTask = async () => {
  if (newTask.value && startTime.value && endTime.value) {
    const task = {
      name: newTask.value,
      startTime: startTime.value,
      endTime: endTime.value,
      elapsedTime: 0,
      done: false,
    };
    tasks.value.push(task);
    newTask.value = '';
    startTime.value = '';
    endTime.value = '';

    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'users', user.uid, 'tasks'), task);
      }
      localStorage.setItem('tasks', JSON.stringify(tasks.value));
    } catch (error) {
      console.error('Error adding task to Firestore: ', error);
    }
  }
};

const removeTask = async (index) => {
  const taskToRemove = tasks.value[index];
  tasks.value.splice(index, 1);

  try {
    const user = auth.currentUser;
    if (user) {
      const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'tasks'));
      querySnapshot.forEach(async (doc) => {
        if (
          doc.data().name === taskToRemove.name &&
          doc.data().startTime === taskToRemove.startTime &&
          doc.data().endTime === taskToRemove.endTime
        ) {
          await deleteDoc(doc.ref);
        }
      });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
  } catch (error) {
    console.error('Error removing task from Firestore: ', error);
  }
};

const markTaskAsDone = async (index) => {
  const taskToMark = tasks.value[index];
  taskToMark.done = !taskToMark.done;

  try {
    const user = auth.currentUser;
    if (user) {
      const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'tasks'));
      querySnapshot.forEach(async (doc) => {
        if (
          doc.data().name === taskToMark.name &&
          doc.data().startTime === taskToMark.startTime &&
          doc.data().endTime === taskToMark.endTime
        ) {
          await updateDoc(doc.ref, { done: taskToMark.done });
        }
      });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks.value));
  } catch (error) {
    console.error('Error updating task in Firestore: ', error);
  }
};

const calculateElapsedTime = (startTime, endTime) => {
  const now = new Date();
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);

  if (now < start) {
    return 0;
  } else if (now > end) {
    return 100;
  } else {
    const totalTime = end - start;
    const elapsedTime = now - start;
    return Math.min((elapsedTime / totalTime) * 100, 100);
  }
};

const updateElapsedTimes = () => {
  tasks.value = tasks.value.map(task => ({
    ...task,
    elapsedTime: calculateElapsedTime(task.startTime, task.endTime),
  }));
};

onMounted(async () => {
  const localTasks = localStorage.getItem('tasks');
  if (localTasks) {
    tasks.value = JSON.parse(localTasks);
  }

  tasks.value = [];

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'tasks'));
      querySnapshot.forEach((doc) => {
        tasks.value.push(doc.data());
      });
    }
  });

  const interval = setInterval(updateElapsedTimes, 1000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>
<template>
  <div class="bg-mine text-white-600 pt-10 lg:pl-18 min-h-screen flex flex-col">
    <div class="container mx-auto mt-10 pb-10">
      <Navbar />
    </div>
    <div class="container mx-auto mt-10 flex-grow px-4"> 
    
      <div class="bg-bine p-4 rounded-lg shadow-md">
        <form @submit.prevent="addTask">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="task">
            
            </label>
            <input
              v-model="newTask"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="task"
              type="text"
              placeholder="Enter your task"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="startTime">
              Start at:
            </label>
            <input
              v-model="startTime"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="startTime"
              type="time"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="endTime">
              End Time
            </label>
            <input
              v-model="endTime"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="endTime"
              type="time"
            />
          </div>
          <div class="flex items-center justify-between">
            <button class="bg-tine text-white py-2 px-4 mt-4 rounded-lg" type="submit">Add Task</button>
          </div>
        </form>
      </div>

      <div class="mt-6">
        
        <ul>
          <li
            v-for="(task, index) in tasks"
            :key="index"
            class="relative bg-white p-4 rounded-lg shadow-md mb-6"
          >
            <button
              @click="removeTask(index)"
              class="absolute top-1.5 right-6 text-red-500 hover:text-red-700 font-bold text-3xl"
            >
              &times;
            </button>
            <h4 class="font-semibold text-lg">{{ task.name }}</h4>
            <span>
              <p class="font-bold text-tine text-sm">Allotted Time: {{ task.startTime }} - {{ task.endTime }}</p>
              <div class="flex items-center text-sm">
                <p class="mr-[170px] mt-[-3]">Elapsed Time: {{ task.elapsedTime.toFixed(2) }}%</p>
                <label class="inline-flex items-center ml-2 ">
                  <input type="checkbox" @change="markTaskAsDone(index)" class="form-checkbox h-5 mb-1 w-5 text-tine">
                </label>
              </div>
            </span>
            <div class="bg-gray-300 w-full rounded-full h-4 mt-2">
              <div
                class="bg-tine h-4 rounded-full"
                :style="{ width: task.elapsedTime + '%' }"
              ></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
