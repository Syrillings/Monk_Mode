import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  EmailAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCIGHcdbGnTQIlxAxcwKOv3c-6ZPh3Rmz8",
  authDomain: "monk-mode-92769.firebaseapp.com",
  projectId: "monk-mode-92769",
  storageBucket: "monk-mode-92769.appspot.com",
  messagingSenderId: "647279608797",
  appId: "1:647279608797:web:7754996340edba6b99ec34",
  databaseURL: "https://monk-mode-92769-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app); 
const realtimeDatabase = getDatabase(app);
const storage = getStorage(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistence set to local"))
  .catch((error) => console.error("Error setting persistence:", error));

onAuthStateChanged(auth, (currentUser) => {
  if (currentUser) {
    console.log("User is signed in:", currentUser.displayName);
  } else {
    console.log("No user signed in");
  }
});

const googleProvider = new GoogleAuthProvider();

export {
  app,
  auth,
  firestore, 
  realtimeDatabase,
  storage,
  googleProvider,
  onAuthStateChanged,
  signInWithPopup,
  EmailAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseConfig,
  signOut,
  getAuth
};