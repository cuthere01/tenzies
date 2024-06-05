
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0qysIFi6ql1UiRsRlEHD0_Vhb6Fw-myQ",
  authDomain: "tenzies-ee170.firebaseapp.com",
  projectId: "tenzies-ee170",
  storageBucket: "tenzies-ee170.appspot.com",
  messagingSenderId: "185032775016",
  appId: "1:185032775016:web:408d53fa0cb7f3f66c72dd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const userDataCollection = collection(db, "userData");
