<script setup>
import Bottom from '/src/components/bottom.vue';
import { ref, onMounted, onUnmounted, watch, computed, nextTick  } from 'vue';
import Navbar from '@/components/navbar2.vue';
import { getFirestore, collection, doc, addDoc, getDocs, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { state } from '../state';
import Draggable from 'vuedraggable';
import Microphone from '/microphone.png';
import AI from '/AI.png';
import Text from '/text.png';
import { generateAIResponse } from "/src/Utils/GeminiAPI";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { LocalNotifications } from '@capacitor/local-notifications';

const db = getFirestore();
const auth = getAuth();
const aiText = ref(""); 
const newTask = ref('');
const startTime = ref('');
const endTime = ref('');
const isModalOpen = ref(false);
const isAnimating = ref(false);
const issAnimating = ref(false);

const userInput = ref(""); 
const isRecording = ref(false);
const isProcessing = ref(false);
let recognition = null;

const requestNotificationPermission = async () => {
  const { granted } = await LocalNotifications.requestPermissions();
  if (!granted) {
    console.error('Notification permission not granted');
  }
};

const scheduleNotification = async (task) => {
  const endTime = new Date(task.endTime);
  const notificationTime = new Date(endTime.getTime() - 1 * 60 * 1000); // 1 minute before end time
  const now = new Date();

  if (notificationTime > now) {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: Number(task.id.replace(/\D/g, "").slice(-6)),
          title: ` Task Ending Soon! ⏳`,
          body: `You have 1 minute left before "${task.name}". Ends at ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}.`,
          schedule: { at: notificationTime },
          sound: 'default',
          smallIcon: 'notification',
          largeIcon: 'notification',
          importance: 5,
          vibrate: [200, 100, 200],
          foreground: true,
          channelId: "TASK_NOTIFICATION_CHANNEL",
        },
      ],
    });

    console.log(`Notification scheduled for task "${task.name}" at ${notificationTime}`);
  } else {
    console.log(`Skipped notification for task "${task.name}" because it's too close to current time.`);
  }
};

LocalNotifications.addListener('localNotificationReceived', async (notification) => {
  console.log(' Notification received:', notification);


  await LocalNotifications.schedule({
    notifications: [
      {
        id: notification.id + 1000,
        title: notification.title,
        body: notification.body,
        sound: 'default',
        smallIcon: 'notification',
        largeIcon: 'notification',
        importance: 5,
        vibrate: [200, 100, 200],
      },
    ],
  });
});



const isNative = () => {
  return window.Capacitor && window.Capacitor.isNativePlatform();
};

const toggleRecording = async () => {
  if (isProcessing.value) return;

  if (!isRecording.value) {
    // Start recording
    if (isNative()) {
      await useCapacitorSpeechRecognition();
    } else {
      await useWebSpeechAPI();
    }
  } else {
    // Stop recording
    isRecording.value = false;
    isProcessing.value = true;

    await nextTick();


    const waitForUserInput = async () => {
      let retries = 0;
      while (!userInput.value?.trim() && retries < 50) { 
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }
    };

    await waitForUserInput();

    if (!userInput.value?.trim()) {
      console.error("User input is empty. Cannot generate tasks.");
      isProcessing.value = false;
      return;
    }

    try {
      await generatePlan(userInput.value);
      isProcessing.value = false;
      isModalOpen.value = false;
    } catch (error) {
      console.error("Error generating plan:", error);
      isProcessing.value = false;
    }
  }
};

const useCapacitorSpeechRecognition = async () => {
  console.log("🔊 Calling useCapacitorSpeechRecognition...");

  if (!isRecording.value) {
    try {
      
      if (Capacitor.getPlatform() === 'ios') {
        const hasPermission = await SpeechRecognition.hasPermission();
        if (!hasPermission.granted) {
          await SpeechRecognition.requestPermission();
        }
      }

      isRecording.value = true;

      await SpeechRecognition.start({
        language: 'en-US',
        maxResults: 3,
        partialResults: true,
        popup: false, // For iOS devices
      });

      userInput.value = '';

      // Capture partial results for a live typing feel
      SpeechRecognition.addListener('partialResults', (data) => {
        if (data.matches && data.matches.length > 0) {
          userInput.value = data.matches[0];
        }
      });

      SpeechRecognition.addListener('result', (data) => {
        console.log('Final Result:', data);
        if (data.matches && data.matches.length > 0) {
          userInput.value = data.matches[0];
          generatePlan(userInput.value);
        }
        isRecording.value = false;
      });

      // Error handling
      SpeechRecognition.addListener('error', (error) => {
        console.error('SpeechRecognition Error:', error);
        isRecording.value = false;
      });

      // Listening end handler
      SpeechRecognition.addListener('end', () => {
        console.log('SpeechRecognition Ended');
        isRecording.value = false;
      });

    } catch (error) {
      console.error('SpeechRecognition Start Failed:', error);
      isRecording.value = false;
    }
  } else {
    await SpeechRecognition.stop();
    isRecording.value = false;
    console.log('SpeechRecognition Stopped');
  }
};

const useWebSpeechAPI = async () => {
  if (!isRecording.value) {
    if (!recognition) {
      recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true; 
      recognition.interimResults = true; 
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          let transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " "; 
          }
        }
        userInput.value = finalTranscript.trim();
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
      };

      recognition.onend = () => {
        isRecording.value = false;
        if (userInput.value.trim()) {
          generatePlan(userInput.value); 
        }
      };
    }

    isRecording.value = true;
    recognition.start();
  } else {
    recognition.stop();
    isRecording.value = false;
  }
};

const generatePlan = async (aiText) => {
  try {
    if (typeof aiText !== "string" || !aiText.trim()) {
      console.warn("User input is empty. Cannot generate tasks.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      console.warn("User is not authenticated. Cannot save AI tasks.");
      return;
    }

    const now = new Date();
    let currentTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());

    const aiTasks = await generateAIResponse(aiText); 

    if (aiTasks && Array.isArray(aiTasks)) {
      const newTasks = aiTasks.map((task, index) => {
        let duration = task.duration ? task.duration * 60 * 1000 : estimateDuration(task.name);
        let start = new Date(currentTime);
        let end = new Date(start.getTime() + duration);

        currentTime = new Date(end); 

        return {
          name: task.name,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          elapsedTime: 0,
          done: false,
          isFrozen: false,
          fromAI: true,
          order: index, 
          createdAt: Date.now(), 
        };
      });

      state.tasks.unshift(...newTasks);

      await Promise.all(
        newTasks.map(async (task) => {
          const docRef = await addDoc(collection(db, "users", user.uid, "tasks"), task);
          task.id = docRef.id; 
        })
      );

      console.log("AI-generated tasks saved to Firebase in order!");
    }
  } catch (error) {
    console.error("Error generating AI tasks: ", error);
  }
};

const animateButton = () => {
  isAnimating.value = true;
  setTimeout(() => {
    isAnimating.value = false;
  }, 250); 
};
const sanimateButton = () => {
  issAnimating.value = true;
  setTimeout(() => {
    issAnimating.value = false;
  }, 250); 
};

const startTimeFormatted = (task) => computed(() =>
  new Date(task.startTime).toISOString().substring(11, 16) 
);

const endTimeFormatted = (task) => computed(() =>
  new Date(task.endTime).toISOString().substring(11, 16)
);

const updateTaskOrder = async () => {
  state.tasks.forEach((task, index) => {
    task.order = index;
  });


  const user = auth.currentUser;
  if (user) {
    const updates = state.tasks.map(task => {
      return updateDoc(doc(db, "users", user.uid, "tasks", task.id), { order: task.order });
    });
    
    await Promise.all(updates)
      .then(() => {
        console.log("Task order updated in Firestore!");
      })
      .catch(error => {
        console.error(" Error updating task order in Firestore:", error);
      });
  }
};

onMounted(async() => {
  await requestNotificationPermission();
  const localTasks = localStorage.getItem('tasks');
  if (localTasks) {
    state.tasks = JSON.parse(localTasks);
  }

  const interval = setInterval(() => {
    updateElapsedTimes();
  }, 1000);

  const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    if (user) {
      await fetchTasks(); 
    } else {
      state.tasks = [];
      localStorage.removeItem('tasks'); ut
    }
  });

  onUnmounted(() => {
    clearInterval(interval);
    unsubscribeAuth(); 
  });
});

watch(state.tasks, (newTasks) => {
  localStorage.setItem('tasks', JSON.stringify(newTasks));
}, { deep: true });

const addTask = async () => {
  if (newTask.value && startTime.value && endTime.value) {
    const now = new Date();
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      ...startTime.value.split(":").map(Number)
    );
    const end = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      ...endTime.value.split(":").map(Number)
    );

    if (end < start) {
      end.setDate(end.getDate() + 1); 
    }

    const task = {
      name: newTask.value,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      elapsedTime: 0,
      done: false,
      isFrozen: false,
      order: state.tasks.length,
      createdAt: Date.now(),
    };

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user signed in");
        return;
      }

      const docRef = await addDoc(
        collection(db, "users", user.uid, "tasks"),
        task
      );

      task.id = docRef.id;

      scheduleNotification(task);
    
      state.tasks.unshift(task);
      localStorage.setItem("tasks", JSON.stringify(state.tasks));

      console.log("✅ Task added successfully:", task);

        newTask.value = "";
      startTime.value = "";
      endTime.value = "";
    } catch (error) {
      console.error("❌ Error adding task:", error);
    }
  } else {
    console.warn("⚠️ Please fill in all fields");
  }
};

//This codebase is screwing my mental health.....Send help

const updateTaskName = (event, task) => {
  task.name = event.target.innerText;
  saveTaskName(task);
};

const saveTaskName = async (task) => {
  
  localStorage.setItem("tasks", JSON.stringify(state.tasks));


  if (auth.currentUser) {
    const taskRef = doc(db, "users", auth.currentUser.uid, "tasks", task.id);
    try {
      await updateDoc(taskRef, { name: task.name });
      console.log("Task updated in Firebase");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }
};


const updateTaskTime = async (index, type, newTime) => {
  if (!newTime) return;

  const task = state.tasks[index];
  if (!task || !task.id) return;

  let [hours, minutes] = newTime.split(":").map(Number);
  
  if (type === "startTime") {
    let newStartTime = new Date(task.startTime);
    newStartTime.setHours(hours, minutes, 0, 0);
    task.startTime = newStartTime.toISOString();
    task.editingStartTime = false;
  } else if (type === "endTime") {
    let newEndTime = new Date(task.endTime);
    newEndTime.setHours(hours, minutes, 0, 0);
    task.endTime = newEndTime.toISOString();
    task.editingEndTime = false;
  }

  // Ensure Vue detects changes
  state.tasks = [...state.tasks];

  try {
    await updateDoc(doc(db, "users", auth.currentUser.uid, "tasks", task.id), {
      startTime: task.startTime,
      endTime: task.endTime,
    });
    console.log("Task time updated in Firestore:", task);
  } catch (error) {
    console.error("❌ Error updating task time in Firestore:", error);
  }
};


const saveTaskToFirestore = async (taskId, updatedFields) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    const taskRef = doc(db, "users", user.uid, "tasks", taskId);
    await updateDoc(taskRef, updatedFields);
    console.log("✅ Task updated successfully in Firestore:", updatedFields);
  } catch (error) {
    console.error("❌ Error updating task in Firestore:", error);
  }
};

const fetchTasks = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const tasksQuery = query(
      collection(db, "users", user.uid, "tasks"),
      orderBy("createdAt", "desc") 
    );

    const querySnapshot = await getDocs(tasksQuery);

    state.tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    localStorage.setItem("tasks", JSON.stringify(state.tasks));

    console.log("✅ Tasks fetched and ordered by newest first!", state.tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
  }
};

const estimateDuration = (taskName) => {
  const defaultDurations = {
    "study": 180 * 60 * 1000,
    "workout": 60 * 60 * 1000,
    "meeting": 45 * 60 * 1000,
  };
  return defaultDurations[taskName.toLowerCase()] || 90 * 60 * 1000; 
};

const loadTasks = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn("User is not authenticated. Cannot load tasks.");
      return;
    }

    const querySnapshot = await getDocs(collection(db, "users", user.uid, "tasks"));

    state.tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Tasks loaded from Firebase", state.tasks);
  } catch (error) {
    console.error("Error loading tasks from Firebase:", error);
  }
};

loadTasks();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    await loadTasks();
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }
});

const removeTask = async (index) => {
  const taskToRemove = state.tasks[index];
  if (!taskToRemove) return;

  try {
    const user = auth.currentUser;
    if (user && taskToRemove.id) {
      await deleteDoc(doc(db, "users", user.uid, "tasks", taskToRemove.id));
      console.log("Task deleted from Firestore:", taskToRemove.id);
    }

    state.tasks = state.tasks.filter((_, i) => i !== index);

    localStorage.setItem("tasks", JSON.stringify(state.tasks));
    
    console.log("Task removed from UI and localStorage.");
  } catch (error) {
    console.error("Error removing task from Firestore:", error);
  }
};

const markTaskAsDone = async (index) => {
  const task = state.tasks[index];

  if (!task.done) {
    // Only calculate elapsedTime when marking as done for the first time
    task.elapsedTime = calculateElapsedTime(task.startTime, task.endTime);
  }

  task.done = !task.done;
  task.isFading = task.done;
  task.isFrozen = task.done;
  task.hideCheckbox = task.done;

  try {
    const user = auth.currentUser;
    if (user && task.id) {
      await updateDoc(doc(db, 'users', user.uid, 'tasks', task.id), task);
    }
  } catch (error) {
    console.error('Error updating task in Firestore: ', error);
  }
};

const calculateElapsedTime = (startTime, endTime) => {
  const now = new Date();
  let start = new Date(startTime);
  let end = new Date(endTime);

  if (end < start) end.setDate(end.getDate() + 1);
  if (now < start) return 0;
  if (now > end) return 100;
  
  return Math.round(((now - start) / (end - start)) * 100);
};

const updateElapsedTimes = () => {
  state.tasks.forEach((task, index) => {
    if (task.done || task.isFrozen) return; 

    const elapsed = calculateElapsedTime(task.startTime, task.endTime);
  
    if (elapsed >= 100) {
      markTaskAsDone(index);
    } else {
      task.elapsedTime = elapsed;
    }
  });

  state.tasks = [...state.tasks]; 
};

const isLoading = ref(false);

const handleClick = async () => {
  if (!aiText.value.trim()) return;

  sanimateButton();
  isLoading.value = true; 

  try {
    await generatePlan(aiText.value); 
    isModalOpen.value = false; 
  } catch (error) {
    console.error("Error generating plan:", error);
  } finally {
    isLoading.value = false; 
  }
};

</script>


<template className="bg-mine backdrop-blur-lg">
  <div class="bg-mine text-white-600 pt-10 lg:pl-18 min-h-screen flex flex-col backdrop-blur-lg">
    <div class="container mx-auto mt-10 pb-10">
      <Navbar />
    </div>
    <div class="container mx-auto mt-10 flex-grow px-4"> 
      <div class="bg-bine p-4 rounded-lg shadow-md backdrop-blur-lg">
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
              Starts at:
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
               <div class="flex items-center justify-between">
                <button @click="() => { animateButton(); isModalOpen = true; }"
    :class="{ 'scale-125': isAnimating }"
    class="transition-transform duration-500 ease-in-out"
    ><img v-bind:src="AI" class="w-[60px] mt-1 mr-3">
  </button>
          </div>
          </div>
        </form>
      </div>

      <div class="mt-6 overflow-y-auto max-h-[70vh] pb-24">
        <draggable 
  v-model="state.tasks" 
  item-key="id"
  animation="300"
  class="space-y-4"
  handle=".drag-handle"
  @end="updateTaskOrder"
>
  <template #item="{ element, index }">
    <li
      class="relative bg-white p-4 rounded-lg shadow-md mb-6 transition-colors duration-500"
    >
      <!-- Drag Handle -->
      <span class="drag-handle cursor-move mr-3 text-gray-500">☰</span>

      <div class="flex justify-between items-center">
      <h4 
  class="font-semibold text-lg" 
  v-if="!element.fromAI"
>
  {{ element.name }}
</h4>

<h4 
  class="font-semibold text-lg p-1 rounded focus:outline-none" 
  v-else 
  contenteditable="true"
  @keydown.enter.prevent
  @input="updateTaskName($event, element)"
>
  {{ element.name }}
</h4>

        <button
          @click="removeTask(index)"
          class="text-red-500 hover:text-red-700 font-bold text-3xl"
        >
          &times;
        </button>
      </div>

      <span>
        <p class="font-bold text-sm" :class="element.isFading ? 'text-gray-500' : 'text-tine'">
          Allotted Time: 

<span 
  v-if="!element.fromAI || !element.editingStartTime" 
  @click="element.fromAI ? (element.editingStartTime = true) : null"
  class="cursor-pointer"
>
  {{ new Date(element.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
</span>
<input
  v-if="element.fromAI && element.editingStartTime"
  type="time"
  :value="startTimeFormatted(element).value" 
  @input="(e) => element.startTimeTemp = e.target.value"
  @blur="updateTaskTime(index, 'startTime', element.startTimeTemp)"
  @keydown.enter="updateTaskTime(index, 'startTime', element.startTimeTemp)"
  class="shadow border rounded w-20 py-1 px-2 text-gray-700"
  autofocus
/>

<span> - </span>

<!-- END TIME -->
<span 
  v-if="!element.fromAI || !element.editingEndTime" 
  @click="element.fromAI ? (element.editingEndTime = true) : null"
  class="cursor-pointer"
>
  {{ new Date(element.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
</span>
<input
  v-if="element.fromAI && element.editingEndTime"
  type="time"
  :value="endTimeFormatted(element).value" 
  @input="(e) => element.endTimeTemp = e.target.value"
  @blur="updateTaskTime(index, 'endTime', element.endTimeTemp)"
  @keydown.enter="updateTaskTime(index, 'endTime', element.endTimeTemp)"
  class="shadow border rounded w-20 py-1 px-2 text-gray-700"
  autofocus
/>



        </p>
        <div class="flex justify-between items-center text-sm">
          <p :class="{ 'text-black': element.isFading, 'text-black': !element.isFading }">
            Elapsed Time: {{ element.elapsedTime.toFixed(0) }}%
          </p>
          <label v-if="!element.done" class="inline-flex items-center">
            <input type="checkbox" @change="markTaskAsDone(index)" class="form-checkbox h-5 w-5 text-tine">
          </label>
        </div>
      </span>

      <div class="bg-gray-200 w-full rounded-full h-4 mt-2">
        <div
          :class="element.isFading ? 'bg-gray-500' : 'bg-tine'"
          class="h-4 rounded-full transition-colors duration-500"
          :style="{ width: element.elapsedTime + '%' }"
        ></div>
      </div>
    </li>
  </template>
</draggable>
      </div>
    </div>
  <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-bine p-8 rounded-2xl shadow-lg w-96 relative overflow-hidden">  <button
        @click="isModalOpen = false"
        class="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold text-3xl transition-colors duration-300"  >
        &times;
      </button>

      <h2 class="text-2xl font-bold mb-4 text-center text-tine">Plan Your Day</h2>  
      <textarea v-model="aiText" class="w-full h-[250px] p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-tine transition duration-300"></textarea>  <div class="flex justify-center mt-6 space-x-4">  
        <button
  @click="toggleRecording"
  :class="{
    'scale-110 bg-red-500': isRecording,
    'bg-tine hover:bg-tine-700': !isRecording
  }"
  class="transition-transform duration-300 ease-in-out text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-tine-300 flex items-center"
>
  <!-- STATE 1: Default (Before Recording) -->
  <template v-if="!isRecording && !isProcessing">
    <img :src="Microphone" class="w-[30px] mr-2 inline-block" />
    <span class="inline-block">Voice</span>
  </template>

  <!-- STATE 2: Recording -->
  <template v-else-if="isRecording">
    <img :src="Microphone" class="w-[30px] mr-2 inline-block" />
    <span class="inline-block">Recording...</span>
  </template>

  <!-- STATE 3: Processing -->
  <template v-else-if="isProcessing">
    <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-bine"></div>
    <span class="inline-block ml-2">Processing...</span>
  </template>
</button>

        <button 
  @click="handleClick" 
  :class="{ 'scale-110': issAnimating }"
  class="transition-transform duration-300 ease-in-out bg-tine hover:bg-tine-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-tine-300 flex items-center justify-center w-24 h-12 relative"
>
  <template v-if="isLoading">
    <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-bine"></div>
  </template>
  <template v-else>
    <img :src="Text" class="w-[30px] mr-2 inline-block"> 
    <span class="inline-block">Send</span>
  </template>
</button>
     </div>

    </div>
  </div>
  </div>
  <Bottom/>
</template>

<style scoped>
.bg-mine {
  background-color: #EAC4D5;
}
</style>