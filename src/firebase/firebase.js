import { initializeApp } from "firebase/app";
import {getFirestore, collection} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-5z9vAW8zbz-Dz0V3vZdYkgG96J6n5OE",
  authDomain: "filmyverse-30676.firebaseapp.com",
  projectId: "filmyverse-30676",
  storageBucket: "filmyverse-30676.appspot.com",
  messagingSenderId: "490835951532",
  appId: "1:490835951532:web:0015fd9363df35bec14409"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const moviesRef = collection(db,'movies');
export const reviewsRef = collection(db,'reviews');
export const usersRef = collection(db,'users');
export default app;