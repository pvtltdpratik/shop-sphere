import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Debug: Log environment variables
console.log('=== FIREBASE CONFIG ===');
console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? '✓ Present' : '✗ Missing');
console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log('Storage Bucket:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate config
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field]);

if (missingFields.length > 0) {
  console.error('❌ Missing Firebase config fields:', missingFields);
  console.error('Make sure .env.local exists in project root with all values!');
}

let app;
try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

// Initialize services
let auth, db, storage;

try {
  auth = getAuth(app);
  auth.languageCode = 'en';
  console.log('✅ Auth initialized');
} catch (error) {
  console.error('❌ Auth initialization failed:', error);
}

try {
  // IMPORTANT: Specify your database name 'mainbase'
  db = getFirestore(app, 'mainbase');
  console.log('✅ Firestore initialized with database: mainbase');
} catch (error) {
  console.error('❌ Firestore initialization failed:', error);
  throw error;
}

try {
  storage = getStorage(app);
  console.log('✅ Storage initialized');
} catch (error) {
  console.error('❌ Storage initialization failed:', error);
}

export { auth, db, storage };
export default app;