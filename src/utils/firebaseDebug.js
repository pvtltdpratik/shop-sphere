import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    
    // Try to read a non-existent document (this still tests connectivity)
    const testRef = doc(db, 'test', 'connection-test');
    await getDoc(testRef);
    
    console.log('✅ Firestore is connected');
    return true;
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    
    if (error.message.includes('offline')) {
      console.error('Possible causes:');
      console.error('1. Internet connection is down');
      console.error('2. Firebase project is disabled');
      console.error('3. Firestore database doesn\'t exist');
      console.error('4. Security rules are blocking access');
    }
    
    return false;
  }
};