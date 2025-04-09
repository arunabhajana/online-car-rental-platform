  import { initializeApp } from "firebase/app";
  import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword 
  } from "firebase/auth";
  import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    serverTimestamp 
  } from "firebase/firestore";
  import { getStorage } from "firebase/storage";
  import { getFunctions } from "firebase/functions"; 

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const functions = getFunctions(app); 
  const googleProvider = new GoogleAuthProvider();


  const saveUserToFirestore = async (user) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        username: user.displayName || "Anonymous",
        role: "user",
        createdDate: serverTimestamp() 
      });
    }
  };

  const loginWithEmail = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(userCredential.user);
    return userCredential;
  };

  const loginWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    await saveUserToFirestore(userCredential.user);
    return userCredential;
  };

  export { auth, loginWithEmail, loginWithGoogle, db, storage, functions }; 
