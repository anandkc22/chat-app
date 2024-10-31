import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyD1L0Ve9B4nErutdeVBGWqPQr6G62E5KW0",
  authDomain: "chat-app-4e155.firebaseapp.com",
  projectId: "chat-app-4e155",
  storageBucket: "chat-app-4e155.appspot.com",
  messagingSenderId: "8093424564",
  appId: "1:8093424564:web:bbde4a16d89ee6c999f0e1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
      
const signup = async (username, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        username: username.toLowerCase(),
        email,
        name: "",
        avatar: "",
        bio: "Hey, there I am using chat app.",
        lastSeen: Date.now(),
      });
      
      await setDoc(doc(db, "chats", user.uid), {
        chatData: []
      });
      
    } catch (error) {
      console.error(error);
      toast.error(error.code.split("/")[1].split("-").join(' '));
    }
};

const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split("/")[1].split("-").join(' '));
    }
}

const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split("/")[1].split("-").join(' '));
    }
}

const resetPassword = async (email) => {
  if (!email) {
    toast.error("Please enter your email");
    return null;
  }
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("email", "==", email));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent!");
      }
      else {
        toast.error("User not found");
      }
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
}
  
export {signup, login, logout, resetPassword, auth, db}