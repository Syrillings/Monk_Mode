import { initializeApp } from "firebase/app";

import {browserLocalPersistence, setPersistence} from "firebase/auth";
import {GoogleAuthProvider, signInWithPopup, EmailAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { user } from '/user';
import { getStorage } from 'firebase/storage';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCIGHcdbGnTQIlxAxcwKOv3c-6ZPh3Rmz8",
    authDomain: "monk-mode-92769.firebaseapp.com",
    projectId: "monk-mode-92769",
    storageBucket: "monk-mode-92769.appspot.com",
    messagingSenderId: "647279608797",
    appId: "1:647279608797:web:7754996340edba6b99ec34",
    databaseURL: "https://monk-mode-92769-default-rtdb.firebaseio.com/"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const realtimeDatabase = getDatabase(app);
const storage = getStorage(app);
setPersistence(auth, browserLocalPersistence)

onAuthStateChanged(auth, async (currentUser) => {
  console.log('Function Activated');
  if (currentUser) {
    user.displayName = currentUser.displayName;
    console.log('User display name:', user.displayName);
  } else {
   user.displayName = '';  
  }
});


const googleProvider = new GoogleAuthProvider();

export {app, auth, realtimeDatabase, onAuthStateChanged, googleProvider, signInWithPopup, EmailAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword,storage, getAuth, getFirestore};
