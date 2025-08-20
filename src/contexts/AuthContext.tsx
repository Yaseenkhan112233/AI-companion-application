// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import React, {
//   createContext,
//   useState,
//   useContext,
//   ReactNode,
//   useEffect,
// } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// interface User {
//   uid: string;
//   email: string | null;
//   displayName: string | null;
// }

// interface AuthContextType {
//   initializing: boolean;
//   currentUser: User | null;
//   signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
//   signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
//   signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
//   logout: () => Promise<void>;
//   loading: boolean;
//   setResults: (results: any) => void;
//   results: any;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [loading, setLoading] = useState(false);
//   const [initializing, setInitializing] = useState(true);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);
//   const [results, setResults] = useState<string>('');

//   useEffect(() => {
//     // Configure Google Sign-In
//     try {
//       GoogleSignin.configure({
//         webClientId: '191123860425-of562ahgj7omb28vpq4b3rm7fdairs98.apps.googleusercontent.com',
//         offlineAccess: false,
//       });
//       console.log('✅ AuthContext: Google Sign-In configured successfully');
//     } catch (error) {
//       console.error('❌ AuthContext: Error configuring Google Sign-In:', error);
//     }
//   }, []);

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return () => subscriber();
//   }, []);

//   const onAuthStateChanged = async (authUser: any) => {
//     console.log('🔄 AuthContext: Auth state changed:', authUser ? 'User signed in' : 'User signed out');
    
//     try {
//       if (authUser) {
//         const { uid, email, displayName } = authUser;
//         console.log('👤 AuthContext: User data:', { uid, email, displayName });
//         setCurrentUser({ uid, email, displayName });
//         await AsyncStorage.setItem('userToken', uid);
//         console.log('💾 AuthContext: User token stored successfully');
//       } else {
//         console.log('🚪 AuthContext: No user authenticated, clearing data');
//         setCurrentUser(null);
//         await AsyncStorage.removeItem('userToken');
//       }
//     } catch (error) {
//       console.error('❌ AuthContext: Error in onAuthStateChanged:', error);
//     } finally {
//       if (initializing) {
//         setInitializing(false);
//         console.log('✅ AuthContext: Initialization complete');
//       }
//     }
//   };

//   const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
//     console.log('🚀 AuthContext: signInWithGoogle function called - START');
    
//     try {
//       setLoading(true);
//       console.log('🔄 AuthContext: Loading set to true');
      
//       // STEP 1: Check Google Play Services
//       console.log('📱 AuthContext: STEP 1 - Checking Google Play Services...');
//       try {
//         await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//         console.log('✅ AuthContext: STEP 1 - Google Play Services available');
//       } catch (playServicesError: any) {
//         console.error('❌ AuthContext: STEP 1 - Play Services error:', playServicesError);
//         setLoading(false);
//         return { 
//           success: false, 
//           error: `Play Services error: ${playServicesError.message || 'Unknown play services error'}` 
//         };
//       }
      
//       // STEP 2: Google Sign-In
//       console.log('🔐 AuthContext: STEP 2 - Initiating Google Sign-In...');
//       let response;
//       try {
//         response = await GoogleSignin.signIn();
//         console.log('✅ AuthContext: STEP 2 - Google Sign-In completed');
//         console.log('📄 AuthContext: STEP 2 - Response type:', typeof response);
//         console.log('📄 AuthContext: STEP 2 - Response:', JSON.stringify(response, null, 2));
//       } catch (googleSignInError: any) {
//         console.error('❌ AuthContext: STEP 2 - Google Sign-In error:', googleSignInError);
//         setLoading(false);
//         return { 
//           success: false, 
//           error: `Google Sign-In error: ${googleSignInError.message || 'Unknown google signin error'}` 
//         };
//       }
      
//       // STEP 3: Extract ID Token
//       console.log('🎫 AuthContext: STEP 3 - Extracting ID Token...');
//       let idToken = null;
      
//       try {
//         if (response?.data?.idToken) {
//           idToken = response.data.idToken;
//           console.log('✅ AuthContext: STEP 3 - ID Token found in response.data.idToken');
//         } else if (response?.idToken) {
//           idToken = response.idToken;
//           console.log('✅ AuthContext: STEP 3 - ID Token found in response.idToken');
//         } else {
//           console.log('⚠️ AuthContext: STEP 3 - No ID Token in response, trying getTokens...');
//           try {
//             const tokens = await GoogleSignin.getTokens();
//             console.log('📄 AuthContext: STEP 3 - getTokens response:', JSON.stringify(tokens, null, 2));
//             idToken = tokens.idToken;
//             console.log('✅ AuthContext: STEP 3 - ID Token retrieved using getTokens()');
//           } catch (getTokensError: any) {
//             console.error('❌ AuthContext: STEP 3 - getTokens error:', getTokensError);
//             setLoading(false);
//             return { 
//               success: false, 
//               error: `Token extraction error: ${getTokensError.message || 'Could not get tokens'}` 
//             };
//           }
//         }
        
//         if (!idToken) {
//           console.error('❌ AuthContext: STEP 3 - Still no ID token after all attempts');
//           setLoading(false);
//           return { 
//             success: false, 
//             error: 'No ID token received from Google Sign-In after all attempts' 
//           };
//         }
        
//         console.log('✅ AuthContext: STEP 3 - ID Token successfully extracted');
//       } catch (tokenExtractionError: any) {
//         console.error('❌ AuthContext: STEP 3 - Token extraction exception:', tokenExtractionError);
//         setLoading(false);
//         return { 
//           success: false, 
//           error: `Token extraction exception: ${tokenExtractionError.message || 'Unknown token error'}` 
//         };
//       }
      
//       // STEP 4: Create Firebase Credential
//       console.log('🔑 AuthContext: STEP 4 - Creating Firebase credential...');
//       let googleCredential;
//       try {
//         googleCredential = auth.GoogleAuthProvider.credential(idToken);
//         console.log('✅ AuthContext: STEP 4 - Firebase credential created');
//       } catch (credentialError: any) {
//         console.error('❌ AuthContext: STEP 4 - Credential creation error:', credentialError);
//         setLoading(false);
//         return { 
//           success: false, 
//           error: `Credential creation error: ${credentialError.message || 'Unknown credential error'}` 
//         };
//       }
      
//       // STEP 5: Firebase Sign-In
//       console.log('🔥 AuthContext: STEP 5 - Signing in with Firebase...');
//       try {
//         const result = await auth().signInWithCredential(googleCredential);
//         console.log('✅ AuthContext: STEP 5 - Firebase sign-in successful:', result.user.uid);
//         console.log('🎉 AuthContext: ALL STEPS COMPLETED SUCCESSFULLY');
//         setLoading(false);
//         return { success: true };
//       } catch (firebaseError: any) {
//         console.error('❌ AuthContext: STEP 5 - Firebase sign-in error:', firebaseError);
//         setLoading(false);
//         return { 
//           success: false, 
//           error: `Firebase sign-in error: ${firebaseError.message || 'Unknown firebase error'}` 
//         };
//       }
      
//     } catch (unexpectedError: any) {
//       console.error('❌ AuthContext: UNEXPECTED ERROR in signInWithGoogle:');
//       console.error('   - Error type:', typeof unexpectedError);
//       console.error('   - Error message:', unexpectedError?.message);
//       console.error('   - Error code:', unexpectedError?.code);
//       console.error('   - Error stack:', unexpectedError?.stack);
//       console.error('   - Full error object:', unexpectedError);
      
//       setLoading(false);
//       return { 
//         success: false, 
//         error: `Unexpected error: ${unexpectedError?.message || 'Unknown unexpected error'}` 
//       };
//     }
//   };

//   const signInWithEmail = async (
//     email: string,
//     password: string
//   ): Promise<{ success: boolean; error?: string }> => {
//     console.log('📧 AuthContext: signInWithEmail function called');
    
//     if (!email || !password) {
//       return { success: false, error: 'Please enter both email and password.' };
//     }

//     try {
//       setLoading(true);
//       const userCredential = await auth().signInWithEmailAndPassword(email, password);
//       console.log('✅ AuthContext: Email sign-in success:', userCredential.user.uid);
//       setLoading(false);
//       return { success: true };
//     } catch (error: any) {
//       console.error('❌ AuthContext: Email sign-in error:', error);
//       setLoading(false);
      
//       let errorMessage = 'Login failed. Please check your credentials.';
//       if (error.code === 'auth/user-not-found') {
//         errorMessage = 'No account found with this email address.';
//       } else if (error.code === 'auth/wrong-password') {
//         errorMessage = 'Incorrect password. Please try again.';
//       } else if (error.code === 'auth/invalid-email') {
//         errorMessage = 'Invalid email address format.';
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       return { success: false, error: errorMessage };
//     }
//   };

//   const signUpWithEmail = async (
//     email: string,
//     password: string,
//     displayName?: string
//   ): Promise<{ success: boolean; error?: string }> => {
//     if (!email || !password) {
//       return { success: false, error: 'Please enter both email and password.' };
//     }

//     try {
//       setLoading(true);
//       const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      
//       if (displayName && userCredential.user) {
//         await userCredential.user.updateProfile({ displayName });
//       }
      
//       setLoading(false);
//       return { success: true };
//     } catch (error: any) {
//       setLoading(false);
//       let errorMessage = 'Sign up failed. Please try again.';
      
//       if (error.code === 'auth/email-already-in-use') {
//         errorMessage = 'An account with this email already exists.';
//       } else if (error.code === 'auth/invalid-email') {
//         errorMessage = 'Invalid email address format.';
//       } else if (error.code === 'auth/weak-password') {
//         errorMessage = 'Password should be at least 6 characters long.';
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       return { success: false, error: errorMessage };
//     }
//   };

//   const logout = async (): Promise<void> => {
//     try {
//       setLoading(true);
//       setCurrentUser(null);
//       await auth().signOut();
//       try {
//         await GoogleSignin.revokeAccess();
//       } catch (googleError) {
//         console.log('Google revoke access failed (normal if not signed in with Google)');
//       }
//       await AsyncStorage.removeItem('userToken');
//       await AsyncStorage.removeItem('onboarding_complete');
//     } catch (error: any) {
//       console.error('Error during logout:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value: AuthContextType = {
//     initializing,
//     currentUser,
//     signInWithGoogle,
//     signInWithEmail,
//     signUpWithEmail,
//     logout,
//     loading,
//     results,
//     setResults,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



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
      
      // Check Google Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Google Sign-In
      const response = await GoogleSignin.signIn();
      
      // Extract ID Token
      let idToken = null;
      
      if (response?.data?.idToken) {
        idToken = response.data.idToken;
      } else if (response?.idToken) {
        idToken = response.idToken;
      } else {
        // Fallback to getTokens
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }
      
      if (!idToken) {
        return { 
          success: false, 
          error: 'No ID token received from Google Sign-In. Please try again.' 
        };
      }
      
      // Create Firebase credential and sign in
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      
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
      } else if (error.message && error.message.includes('DEVELOPER_ERROR')) {
        errorMessage = 'Configuration error. Check your google-services.json file.';
      } else if (error.message && error.message.includes('SIGN_IN_CANCELLED')) {
        errorMessage = 'Sign-in was cancelled.';
      } else if (error.message && error.message.includes('NETWORK_ERROR')) {
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