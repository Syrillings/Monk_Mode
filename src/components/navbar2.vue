<script setup>
import { ref, onMounted } from 'vue';
import { auth, onAuthStateChanged, storage, realtimeDatabase } from '../firebase';
import logo6 from '/src/assets/Images/navuser.png';
import logo8 from '/src/assets/Images/newmonk.png';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set, get } from 'firebase/database';

const userDisplayName = ref('');
const profilePicture = ref(logo6); 
const fileInput = ref(null);

const loadProfilePicture = async () => {
  const user = auth.currentUser;
  if (user) {
    const profilePicRef = dbRef(realtimeDatabase, `users/${user.uid}/profileImageUrl`);
    const snapshot = await get(profilePicRef);
    if (snapshot.exists()) {
      profilePicture.value = snapshot.val();
      console.log("Snapshot Saved")
    }
  }
};

onMounted(() => {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const displayName = firebaseUser.displayName;
      console.log(firebaseUser.displayName)
      const firstName = displayName.split(' ')[0];
      userDisplayName.value = firstName;
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
  <nav class="bg-tine z-10 fixed top-0 left-0 w-full p-1 mt-5 flex justify-between items-center">
    <div class="flex items-center ml-[20]">
      <img :src="logo8" class="h-50 w-20 mb-3">
      <h1 class="text-white font-bold text-2xl font-josefin"> {{ userDisplayName }}'s Board</h1>
    </div>
   
  </nav>
</template>



