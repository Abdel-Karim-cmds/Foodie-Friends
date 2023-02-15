// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgkgjt4ZIF1pnJ2Vq8AEk9UW7sIdwT1u0",
  authDomain: "foodie-friends-26f3f.firebaseapp.com",
  projectId: "foodie-friends-26f3f",
  storageBucket: "foodie-friends-26f3f.appspot.com",
  messagingSenderId: "146330827008",
  appId: "1:146330827008:web:55c982392d29f09d3d5be5",
  measurementId: "G-54719JC13Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// export default analytics;