import React, { createContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { createUserProfile, getUserProfile } from '../firebase/firebaseServices';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Setup auth state listener only once
  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;
      
      try {
        console.log('Auth state changed:', currentUser?.uid);
        
        if (currentUser) {
          setUser(currentUser);
          
          try {
            // Try to get existing profile
            let profile = await getUserProfile(currentUser.uid);
            
            // If profile doesn't exist, create it
            if (!profile) {
              console.log('Creating new user profile...');
              await createUserProfile(currentUser.uid, {
                email: currentUser.email,
                displayName: currentUser.displayName || 'User',
                photoURL: currentUser.photoURL,
              });
              
              // Fetch the newly created profile
              profile = await getUserProfile(currentUser.uid);
            }
            
            if (isMounted) {
              setUserProfile(profile);
            }
          } catch (firestoreError) {
            console.error('Firestore error:', firestoreError.message);
            // Continue anyway - user is authenticated even if Firestore fails
            if (isMounted) {
              setUserProfile(null);
            }
          }
        } else {
          if (isMounted) {
            setUser(null);
            setUserProfile(null);
          }
        }
      } catch (err) {
        console.error('Auth error:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setAuthInitialized(true);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []); // Empty dependency array - run only once on mount

  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null);
      console.log('Starting Google sign-in...');
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      console.log('Google sign-in successful');
      
      // Profile will be created/fetched by the auth state listener
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      throw error;
    }
  }, []);

  const value = {
    user,
    userProfile,
    loading: loading && !authInitialized, // Only loading until auth is initialized
    error,
    loginWithGoogle,
    logout,
    isAdmin: userProfile?.isAdmin || false,
    authInitialized,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};