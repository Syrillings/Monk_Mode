<script setup>
import logo5 from '/src/assets/Images/createaccount.png'
import logo3 from '/src/assets/Images/at .png'
import logo4 from '/src/assets/Images/padlock.png'
import logo6 from '/src/assets/Images/user.png'
import logo8 from '/nonk.png'
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { auth, createUserWithEmailAndPassword } from '../firebase';  // Adjust the path if necessary
import { updateProfile } from "firebase/auth"; 

const isLoading = ref(false);
const username = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleClick = () => {
  isLoading.value = true;
};


const handleEmailSignUp = async (event) => {
  event.preventDefault();
 
  handleClick();


  if (!email.value || !password.value || !username.value) {
    errorMessage.value = "Email and Password cannot be empty!";
    isLoading.value = false; 
    return;
  }

  try {
  
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

   
    await updateProfile(user, {
      displayName: username.value 
    });

    
    await user.reload(); 


    console.log('User display name', user.displayName);
   
    router.push('/signup');
  } catch (error) {
    console.error('Error creating account:', error);
    errorMessage.value = error.message;
    isLoading.value = false; 
  }
};

</script>
<template>
     <div class="h-screen bg-mine flex items-center justify-center pt-10 lg:pl-18 backdrop-blur-lg ">
       
        <div class="bg-mine  shadow-lg rounded-xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full">
            <div class="ml-[116px]  pb-5">
            <img v-bind:src="logo8" class="h-[100px] ">
        </div>
    <h1 class="font-openSans font-bold text-center text-2xl sm:text-3xl mb-2">Create Account</h1>
    <p class="text-center text-tine font-roboto text-sm mt-6 mb-6 pl-[20px] sm:text-base">Let's Begin Your Journey! 🚀</p>

   
<div class="flex items-center mb-6 w-full">
  <div class="flex-grow border-t border-black"></div>
  <p class="text-center font-bold text-black-1000 px-4 whitespace-nowrap">Let’s Get Your  Account Set Up</p>
  <div class="flex-grow border-t border-black"></div>
</div>

   
<form @submit="handleEmailSignUp">
      <!-- Username input -->
      <div class="relative w-full mb-4">
      <img v-bind:src="logo6" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5">
      <input v-model="username" type="text" placeholder="What Can We Call You?" 
             class="w-full p-3 pl-10 bg-rine rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
    </div>

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

          <div class="flex justify-between items-center mb-4 text-sm pl-1">
            <label class="text-gray-600 flex items-center">
              <input type="checkbox" class="mr-2"> Remember Me
            </label>

          </div>

          <div class="pl-[30px]">
            <button type="submit" 
             v-if="!isLoading"
            class="hover:scale-95 transition-transform duration-200 pl-6">
              <img v-bind:src="logo5" class="h-10 mt-1 mb-2">
            </button>

            <div v-else class="flex items-center justify-center w-full h-10 rounded-full bg-mine">
    <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-tine"></div>
  </div>
              </div>
        </form>
        <div class="pl-[22px]"> <p class="pt-[-5]  mb-[5px] mt-[10px] ">Already Have an account? <RouterLink to="/signup" class="text-tine font-bold hover:underline">Sign In Here</RouterLink></p></div>
        </div>
      
        </div>
</template>