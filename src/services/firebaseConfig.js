// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyIDlvP_QTOHNTnkrFfwVbltONSqDy7rE",
  authDomain: "mytracks-f98bb.firebaseapp.com",
  projectId: "mytracks-f98bb",
  storageBucket: "gs://mytracks-f98bb.appspot.com",
  messagingSenderId: "877647611435",
  appId: "1:877647611435:web:cedbc7b62c4823b7774c6e",
  databseURL: "https://mytracks-f98bb-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);
