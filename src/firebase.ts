import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0405014241",
  appId: "1:54162923759:web:5c2266fd76482ddf483b1a",
  apiKey: "AIzaSyD3VzXthlstky7k7Ul3z4YH4lJBq4SyNcY",
  authDomain: "gen-lang-client-0405014241.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-4baf4bdb-fde7-4688-9b0c-2d4be190c4c1",
  storageBucket: "gen-lang-client-0405014241.firebasestorage.app",
  messagingSenderId: "54162923759"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export default app;
