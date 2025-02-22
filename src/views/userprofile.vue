<script setup>
import Bottom from '/src/components/bottom.vue';
import Camera from '/camera.png'
import { ref, onMounted } from 'vue';
import { auth, onAuthStateChanged, storage, realtimeDatabase, signOut, getAuth} from '../firebase'; 
import logo6 from '/src/assets/Images/navuser.png';
import { useRouter } from 'vue-router';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set, get } from 'firebase/database';
import Navbar from '/src/components/navbar3.vue'

const userDisplayName = ref('');
const profilePicture = ref(logo6); 
const fileInput = ref(null);
const email = ref("");

const loadProfilePictureFromLocalStorage = () => {
  const savedProfilePicture = localStorage.getItem('profilePicture');
  if (savedProfilePicture) {
    profilePicture.value = savedProfilePicture;
  }
};


const loadProfilePicture = async () => {
  const user = auth.currentUser;
  if (user) {
    const profilePicRef = dbRef(realtimeDatabase, `users/${user.uid}/profileImageUrl`);
    const snapshot = await get(profilePicRef);
    if (snapshot.exists()) {
      const profileImageUrl = snapshot.val();
      profilePicture.value = profileImageUrl;
       localStorage.setItem('profilePicture', profileImageUrl);
    }
  }
};

onMounted(() => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const displayName = firebaseUser.displayName;
      const firstName = displayName;
      userDisplayName.value = firstName;
      email.value = firebaseUser.email; 
      loadProfilePictureFromLocalStorage();
      await loadProfilePicture();
    } else {
      userDisplayName.value = '';
      profilePicture.value = logo6;
    }
  });
});

const onFileChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePicture.value = e.target.result;
    };
    reader.readAsDataURL(file);

    const storageReference = storageRef(storage, `profile_pictures/${auth.currentUser.uid}.jpg`);

    try {
      await uploadBytes(storageReference, file);
      console.log('File uploaded successfully');

      const downloadURL = await getDownloadURL(storageReference);
      profilePicture.value = downloadURL; // Update with uploaded picture URL
      console.log(downloadURL);
     localStorage.setItem('profilePicture', downloadURL);

      const profilePicRef = dbRef(realtimeDatabase, `users/${auth.currentUser.uid}/profileImageUrl`);
      await set(profilePicRef, downloadURL);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }
};

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const router = useRouter();

const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push('/signup'); // Redirects to the sign-in page
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
    return { handleSignOut };
  };

  
</script>
<template>
  <Navbar/>
  <div class="h-screen bg-mine flex items-center justify-center px-4 sm:px-6">
    <div class="bg-mine shadow-lg rounded-3xl p-6 sm:p-12 max-w-md w-full backdrop-blur-lg ">
      
      <!-- Profile Section -->
      <div class="flex flex-col items-center mb-10">
        <!-- Profile Image with Edit Button -->
        <div class="relative w-28 h-28 mb-4">
          <img
            :src="profilePicture || logo6"
            class="w-full h-full rounded-full bg-gray-400 border-4 border-white object-cover shadow-xl hover:opacity-90 transition-opacity duration-300"
            alt="User Profile"
            @click="triggerFileInput"
          />
          <input
            type="file"
            ref="fileInput"
            @change="onFileChange"
            accept="image/*"
            class="hidden"
          />
          <button 
            class="absolute bottom-1 right-1 bg-tine text-white p-2 rounded-full shadow-md hover:bg-purple-500 transition-all"
            @click="triggerFileInput"
          >
            <img :src="Camera" class="w-5 h-5" alt="Edit" />
          </button>
        </div>
        
        <!-- User Info -->
        <h2 class="font-openSans font-bold text-3xl sm:text-4xl text-tine mt-3">Welcome Back! 👋</h2>
        <p class="text-gray-600 font-roboto text-base sm:text-lg mt-1">{{ email }}</p>
      </div>

      <!-- Profile Details -->
      <div class="space-y-6">
        <div class="bg-mine p-5 rounded-xl shadow-lg transition-all hover:shadow-2xl">
          <div class="flex justify-between items-center">
            <p class="text-gray-500 text-sm">Username:</p>
            <p class="text-tine font-semibold text-lg">{{ userDisplayName }}</p>
          </div>
        </div>

        <div class="bg-mine p-5 rounded-xl shadow-lg transition-all hover:shadow-2xl">
          <div class="flex justify-between items-center">
            <p class="text-gray-500 text-sm">Email:</p>
            <p class="text-tine font-semibold text-lg">{{ email }}</p>
          </div>
        </div>
      </div>

      <!-- Sign Out Button -->
      <button @click="handleSignOut" class="w-full bg-tine text-white font-semibold py-3 rounded-xl hover:bg-purple-600 transition-all duration-300 shadow-lg mt-10">
        Sign Out
      </button>
    </div>
  </div>
  <Bottom/>
</template>

<style scoped>
.transition-all {
  transition: all 0.3s ease-in-out;
}

.font-openSans {
  font-family: 'Open Sans', sans-serif;
}

.font-roboto {
  font-family: 'Roboto', sans-serif;
}



.bg-opacity-90 {
  background-color: rgba(0, 0, 0, 0.1);
}

.shadow-xl {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.shadow-lg {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}



.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

.rounded-xl {
  border-radius: 1rem;
}

.rounded-3xl {
  border-radius: 1.5rem;
}
</style>
