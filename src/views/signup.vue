
<script setup>
import logo4 from '/src/assets/Images/padlock.png';
import logo1 from '/src/assets/Images/set.png';
import logo3 from '/src/assets/Images/at .png'; 
import logo5 from '/src/assets/Images/signup.png'; 
import { ref } from 'vue';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword } from '/src/firebase.js';
import { useRouter } from 'vue-router';

const isLoading = ref(false);
const isStillLoading = ref(false);
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();
const text = ref("")

const PasswordResetEmail = async () => {
  try {
    await sendPasswordResetEmail(auth, email.value);
    text.value=('Password reset email sent. Please check your inbox.');
    email.value = '';
  } catch (error) {
    errorMessage.value = error.message;
  }
};

const handleClick = () => {
  isLoading.value = true;
};

const handleEmailSignIn = async (event) => {
  event.preventDefault();

  handleClick();

  if (!email.value || !password.value) {
    errorMessage.value = "LogIn details missing";
    isLoading.value = false; 
    return;
  }
  try {

    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    
    setTimeout(() => {
      router.push('/main');
      });
  } catch (error) {
    console.error("Error signing in:", error);
    errorMessage.value = error.message; 
    isLoading.value = false; 
  }
};

const googleclick = () =>{
  isStillLoading.value= true;
}

const handleGoogleSignIn = async (event) => {
  event.preventDefault();

  googleclick();

  try {
    await signInWithPopup(auth, googleProvider);
    isStillLoading.value= false;
    router.push('/main');
  } catch (error) {
    console.error("Error signing in with Google: ", error.message);
    errorMessage.value = error.message; 
    isStillLoading.value = false;
  }
};
</script>


<template>
  
    <div class="h-screen bg-mine flex items-center justify-center pt-10 lg:pl-18">
  <div class="bg-mine  shadow-lg rounded-xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full">
    <h1 class="font-openSans font-bold text-center text-2xl sm:text-3xl mb-2">Sign In</h1>
    <p class="text-center text-black-600 mb-6 font-roboto text-sm sm:text-base">Welcome Back! Let's continue with,</p>

   
    <div class="flex justify-between mb-6 space-x-4 gap-5">
          <button @click="handleGoogleSignIn"
          v-if="!isStillLoading" 
           class=
           "hover:scale-95 transition-transform duration-200 sm:pl-5  ">
            <img v-bind:src="logo1" class="pl-[70px]  h-13 mt-[-10] sm:mt-0.5 mr-5 w-43.25">
          </button>
          <div v-else class="flex items-center justify-center w-full h-10 rounded-full bg-mine">
    <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-tine"></div>
  </div>
        </div>


<div class="flex items-center mb-6 w-full">
  <div class="flex-grow border-t border-black"></div>
  <p class="text-center text-black px-4 whitespace-nowrap">Or Sign In With</p>
  <div class="flex-grow border-t border-black"></div>
</div>


    
<form @submit="handleEmailSignIn">
          <div class="relative w-full mb-4">
            <img v-bind:src="logo3" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
            <input v-model="email" type="email" placeholder="Your Email" 
                   class="w-full p-3 pl-10 bg-rine rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
          </div>

          <div class="relative w-full mb-4">
            <img v-bind:src="logo4" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
            <input v-model="password" type="password" placeholder="Your Password" 
                   class="w-full p-3 pl-10  rounded-lg focus:outline-none bg-rine focus:ring-2 focus:ring-purple-400">
          </div>

          <p v-if="errorMessage" class="text-red-500 text-sm mb-4">{{ errorMessage }}</p>
          <p v-if="text" class="text-red-500 text-sm mb-4">{{ text }}</p>

          <div class="flex justify-between items-center mb-4 text-sm">
            <label class="text-gray-600 flex items-center">
              <input type="checkbox" class="mr-2"> Remember Me
            </label>
            <a href="#"  @click="PasswordResetEmail" class=" hover:underline font-bold text-tine">Forgot Password?</a>
          </div>

          <div class="flex justify-center">
  <button 
    v-if="!isLoading" 
    type="submit" 
    @click="handleEmailSignIn" 
    class="focus:scale-95 transition-transform duration-20"
  >
    <img :src="logo5" class="h-15 w-[255px] mt-2 mb-2 mr-1">
  </button>

  <div v-else class="flex items-center justify-center w-full h-10 rounded-full bg-mine">
    <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-tine"></div>
  </div>
</div>
        </form>

        <p class="pl-[16px] mb-[10px] mt-2">  Don't have an account? <RouterLink to="/createaccount" class="text-tine font-bold hover:underline">Create One Here</RouterLink>
        </p>
         

</div>
</div>

</template>
