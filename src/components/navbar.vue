<script setup>
import { ref, onMounted } from 'vue';
import { auth, onAuthStateChanged, storage, realtimeDatabase } from '../firebase'; 
import logo6 from '/src/assets/Images/navuser.png';
import logo8 from '/src/assets/Images/newmonk.png';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set, get } from 'firebase/database';
import Camera from '/camera.png'

const userDisplayName = ref('');
const profilePicture = ref(logo6); 
const fileInput = ref(null);

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
      const firstName = displayName.split(' ')[0];
      userDisplayName.value = firstName;
      
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
</script>



  <template>
  <nav class="bg-tine z-10 fixed top-0 left-0 w-full p-3  flex justify-between items-center">
    <div class="flex items-center ml-[20]">
      <img :src="logo8" class="h-50 w-20 mb-3">
      <h1 class="text-white font-bold text-2xl font-josefin">Hello, {{ userDisplayName }}</h1>
    </div>
    <div class="flex items-center space-x-4">
      <img
        :src="profilePicture || logo6"
        class="w-[78px] h-[78px] rounded-full bg-gray-400 border-2 mt-[10] border-white object-cover cursor-pointer"
        alt="User Profile"
             />
          <input
            type="file"
            ref="fileInput"
            @change="onFileChange"
            accept="image/*"
            class="hidden"
          />
          <button 
            class="absolute bottom-1 right-1 text-white p-2 rounded-full shadow-md "
            @click="triggerFileInput"
          >
            <img :src="Camera" class="w-4 h-4" alt="Edit" />
          </button>
    </div>
  </nav>
</template>