import { initializeApp } from "firebase/app";
import firebaseConfig from "./config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
