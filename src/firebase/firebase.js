import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { app } from "./init";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const googleAuth = async () => {
  const gAuth = await signInWithPopup(auth, googleProvider);
  return gAuth;
};

export const facebookAuth = async () => {
  const fbAuth = await signInWithPopup(auth, facebookProvider);
  return fbAuth;
};
