// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import {getAuth, initializeAuth} from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyASGr7s0BoK7iZXqpG93m2vzZ7cJSo1fnw",
  authDomain: "wildlife-observation.firebaseapp.com",
  projectId: "wildlife-observation",
  storageBucket: "wildlife-observation.appspot.com",
  messagingSenderId: "380687749190",
  appId: "1:380687749190:web:388a6067da41670960ba47",
  measurementId: "G-B2DZZC8NR4"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

// initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//   });

  
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);