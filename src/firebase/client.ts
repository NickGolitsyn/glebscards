import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXAAacyrpflY0IEmHByLkMWmBhe7sJTL4",
  authDomain: "glebscards.firebaseapp.com",
  projectId: "glebscards",
  storageBucket: "glebscards.appspot.com",
  messagingSenderId: "713246068103",
  appId: "1:713246068103:web:10da4e3b6d441a173f9722",
  measurementId: "G-F5KHN0JS47"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {app, db}