import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  initializing: boolean;
  currentUser: User | null;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
  setResults: (results: any) => void;
  results: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [results, setResults] = useState<string>('');

  useEffect(() => {
    // Configure Google Sign-In
    try {
      GoogleSignin.configure({
        webClientId: '191123860425-of562ahgj7omb28vpq4b3rm7fdairs98.apps.googleusercontent.com',
        offlineAccess: false,
      });
    } catch (error) {
      console.error('Error configuring Google Sign-In:', error);
    }
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber();
  }, []);

  const onAuthStateChanged = async (authUser: any) => {
    try {
      if (authUser) {
        const { uid, email, displayName } = authUser;
        setCurrentUser({ uid, email, displayName });
        await AsyncStorage.setItem('userToken', uid);

        // Handle Firestore operations in background
        handleFirestoreUser(authUser).catch(error => {
          console.error('Firestore operation failed:', error);
        });
      } else {
        setCurrentUser(null);
        await AsyncStorage.removeItem('userToken');
      }
    } catch (error) {
      console.error('Error in auth state change:', error);
    } finally {
      if (initializing) {
        setInitializing(false);
      }
    }
  };

  const handleFirestoreUser = async (authUser: any) => {
    try {
      const { uid, email, displayName, phoneNumber, photoURL } = authUser;
      
      const fireStoreUser = await getUserFromFireStore(uid);

      if (!fireStoreUser) {
        await addUserToFireStore({
          uid,
          email,
          displayName,
          phoneNumber,
          photoURL,
        });
      }
    } catch (error) {
      console.error('Firestore operation error:', error);
      throw error;
    }
  };

  const getUserFromFireStore = async (userId: string) => {
    try {
      const userDoc = await firestore().collection('users').doc(userId).get();
      return userDoc.exists ? userDoc.data() : null;
    } catch (error) {
      console.error('Error getting user from Firestore:', error);
      return null;
    }
  };

  const addUserToFireStore = async (authUser: any) => {
    try {
      const { uid, email, displayName, phoneNumber, photoURL } = authUser;

      const userData = {
        uid,
        email,
        displayName,
        phoneNumber,
        photoURL,
        createdAt: new Date(),
        artworksCreatedCount: 0,
        followersCount: 0,
        followingCount: 0,
        likedArtworksCount: 0,
        savedArtworksCount: 0,
      };

      await firestore().collection('users').doc(uid).set(userData);
    } catch (error) {
      console.error('Error adding user to Firestore:', error);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // 1. Check Google Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // 2. Google Sign-In
      const response = await GoogleSignin.signIn();
  
      // 3. Extract ID Token
      let idToken = response?.idToken || response?.data?.idToken;
      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }
      if (!idToken) {
        return { success: false, error: 'No ID token received from Google Sign-In.' };
      }
  
      // 4. Create Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
      // 5. Sign in with Firebase
      const result = await auth().signInWithCredential(googleCredential);
  
      // 6. ✅ Ensure user exists in Firestore
      await addUserToFireStore({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        phoneNumber: result.user.phoneNumber,
        photoURL: result.user.photoURL,
      });
  
      return { success: true };
  
    } catch (error: any) {
      let errorMessage = 'Google sign-in failed. Please try again.';
  
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email address.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid credentials. Please try again.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google sign-in is not enabled in Firebase Console.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.message?.includes('DEVELOPER_ERROR')) {
        errorMessage = 'Configuration error. Check your google-services.json file.';
      } else if (error.message?.includes('SIGN_IN_CANCELLED')) {
        errorMessage = 'Sign-in was cancelled.';
      } else if (error.message?.includes('NETWORK_ERROR')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
  
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    try {
      setLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }
  
    try {
      setLoading(true);
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  
      if (displayName && userCredential.user) {
        await userCredential.user.updateProfile({ displayName });
      }
  
      // ✅ Write new user to Firestore
      await addUserToFireStore({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || displayName || null,
        phoneNumber: userCredential.user.phoneNumber || null,
        photoURL: userCredential.user.photoURL || null,
      });
  
      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Sign up failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters long.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      setCurrentUser(null);
      
      await auth().signOut();
      
      try {
        await GoogleSignin.revokeAccess();
      } catch (googleError) {
        // Google revoke access failed - normal if not signed in with Google
      }
      
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('onboarding_complete');
    } catch (error: any) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    initializing,
    currentUser,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
    loading,
    results,
    setResults,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};