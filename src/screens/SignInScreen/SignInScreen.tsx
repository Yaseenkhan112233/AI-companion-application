
// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
//   TextInput,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { colors, spacing } from '../../theme';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import { GradientBackground } from '../../components/GradientBackground';
// import { useAuth } from '../../contexts/AuthContext';

// interface SignInScreenProps {
//   navigation: any;
// }

// export const SignInScreen = ({ navigation }: SignInScreenProps) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
  
//   // Use the auth context
//   const { signInWithGoogle, signInWithEmail, loading } = useAuth();

//   const handleSuccessfulLogin = async () => {
//     try {
//       console.log('🎯 SignInScreen: Starting handleSuccessfulLogin');
      
//       // Check if questionnaire is completed
//       const isOnboardingComplete = await AsyncStorage.getItem('onboarding_complete');
//       console.log('📋 SignInScreen: Onboarding complete:', isOnboardingComplete);
      
//       if (isOnboardingComplete === 'true') {
//         console.log('🏠 SignInScreen: Navigating to Home');
//         navigation.navigate('Home');
//       } else {
//         console.log('📝 SignInScreen: Navigating to Questionnaire');
//         navigation.navigate('Questionnaire');
//       }
      
//       console.log('✅ SignInScreen: handleSuccessfulLogin completed');
//     } catch (error) {
//       console.error('❌ SignInScreen: Error in handleSuccessfulLogin:', error);
//       // Default to questionnaire screen if there's an error
//       console.log('📝 SignInScreen: Defaulting to Questionnaire due to error');
//       navigation.navigate('Questionnaire');
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       console.log('🔘 SignInScreen: Google sign-in button pressed');
//       console.log('🔍 SignInScreen: signInWithGoogle function available:', typeof signInWithGoogle);
      
//       if (!signInWithGoogle) {
//         throw new Error('signInWithGoogle function is not available from AuthContext');
//       }
      
//       console.log('📞 SignInScreen: Calling signInWithGoogle...');
//       const result = await signInWithGoogle();
      
//       console.log('📊 SignInScreen: Google sign-in result received:', result);
//       console.log('📊 SignInScreen: Result type:', typeof result);
//       console.log('📊 SignInScreen: Result keys:', result ? Object.keys(result) : 'null');
      
//       if (!result) {
//         throw new Error('signInWithGoogle returned null/undefined');
//       }
      
//       if (result.success === true) {
//         console.log('✅ SignInScreen: Google sign-in successful, calling handleSuccessfulLogin');
//         await handleSuccessfulLogin();
//         console.log('✅ SignInScreen: handleSuccessfulLogin completed successfully');
//       } else {
//         console.log('❌ SignInScreen: Google sign-in failed with error:', result.error);
//         const errorMessage = result.error || 'Google sign-in failed for unknown reason';
//         Alert.alert('Sign In Failed', errorMessage);
//       }
//     } catch (error: any) {
//       console.error('❌ SignInScreen: Exception in handleGoogleSignIn:');
//       console.error('   - Error message:', error.message);
//       console.error('   - Error stack:', error.stack);
//       console.error('   - Full error object:', error);
      
//       let errorMessage = 'An unexpected error occurred during Google sign-in.';
//       if (error.message) {
//         errorMessage += ` Details: ${error.message}`;
//       }
      
//       Alert.alert('Sign In Failed', errorMessage);
//     }
//   };

//   const handleSignIn = async () => {
//     try {
//       console.log('📧 SignInScreen: Email sign-in button pressed');
//       console.log('📧 SignInScreen: Email:', email);
//       console.log('📧 SignInScreen: Password length:', password.length);
//       console.log('🔍 SignInScreen: signInWithEmail function available:', typeof signInWithEmail);
      
//       if (!signInWithEmail) {
//         throw new Error('signInWithEmail function is not available from AuthContext');
//       }
      
//       console.log('📞 SignInScreen: Calling signInWithEmail...');
//       const result = await signInWithEmail(email, password);
      
//       console.log('📊 SignInScreen: Email sign-in result received:', result);
//       console.log('📊 SignInScreen: Result type:', typeof result);
//       console.log('📊 SignInScreen: Result keys:', result ? Object.keys(result) : 'null');
      
//       if (!result) {
//         throw new Error('signInWithEmail returned null/undefined');
//       }
      
//       if (result.success === true) {
//         console.log('✅ SignInScreen: Email sign-in successful, calling handleSuccessfulLogin');
//         await handleSuccessfulLogin();
//         console.log('✅ SignInScreen: handleSuccessfulLogin completed successfully');
//       } else {
//         console.log('❌ SignInScreen: Email sign-in failed with error:', result.error);
//         const errorMessage = result.error || 'Email sign-in failed for unknown reason';
//         Alert.alert('Sign In Failed', errorMessage);
//       }
//     } catch (error: any) {
//       console.error('❌ SignInScreen: Exception in handleSignIn:');
//       console.error('   - Error message:', error.message);
//       console.error('   - Error stack:', error.stack);
//       console.error('   - Full error object:', error);
      
//       let errorMessage = 'An unexpected error occurred during email sign-in.';
//       if (error.message) {
//         errorMessage += ` Details: ${error.message}`;
//       }
      
//       Alert.alert('Sign In Failed', errorMessage);
//     }
//   };


//   const handleSignUp = () => {
//     try {
//       console.log('📝 SignInScreen: Navigating to SignUp');
//       navigation.navigate('SignUp' as never);
//     } catch (error: any) {
//       console.error('❌ SignInScreen: Error navigating to SignUp:', error);
//       Alert.alert('Navigation Error', 'Could not navigate to Sign Up screen');
//     }
//   };

//   // Debug auth context
//   console.log('🔍 SignInScreen: Auth context values available:');
//   console.log('   - signInWithGoogle:', typeof signInWithGoogle);
//   console.log('   - signInWithEmail:', typeof signInWithEmail);
//   console.log('   - loading:', loading);

//   return (
//     <GradientBackground>
//       <SafeAreaView style={styles.container}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           style={styles.keyboardAvoid}
//         >
//           <ScrollView
//             contentContainerStyle={styles.scrollContent}
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={styles.header}>
//               <View style={styles.logoContainer}>
//                 <View style={styles.logo} />
//               </View>
//               <Text style={styles.title}>Sign in to continue</Text>
//             </View>

//             <View style={styles.socialButtonContainer}>
//               <TouchableOpacity
//                 style={[styles.googleButton, loading && styles.disabledButton]}
//                 onPress={handleGoogleSignIn}
//                 disabled={loading}
//               >
//                 <FontAwesome name="google" size={20} color="#DB4437" />
//                 <Text style={styles.googleButtonText}>
//                   {loading ? 'Signing in...' : 'Continue with Google'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
         


//             <View style={styles.dividerContainer}>
//               <View style={styles.divider} />
//               <Text style={styles.dividerText}>Or continue with email</Text>
//               <View style={styles.divider} />
//             </View>

//             <View style={styles.form}>
//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputLabel}>Email</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={email}
//                   onChangeText={setEmail}
//                   placeholder="Enter your email"
//                   placeholderTextColor="rgba(255,255,255,0.7)"
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   editable={!loading}
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputLabel}>Password</Text>
//                 <TextInput
//                   style={styles.input}
//                   value={password}
//                   onChangeText={setPassword}
//                   placeholder="Enter your password"
//                   placeholderTextColor="rgba(255,255,255,0.7)"
//                   secureTextEntry
//                   editable={!loading}
//                 />
//               </View>

//               <TouchableOpacity 
//                 style={[styles.signInButton, loading && styles.disabledButton]} 
//                 onPress={handleSignIn}
//                 disabled={loading}
//               >
//                 <Text style={styles.buttonText}>
//                   {loading ? 'Signing in...' : 'Sign In'}
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.footer}>
//               <Text style={styles.footerText}>
//                 Don't have an account?{' '}
//                 <TouchableOpacity onPress={handleSignUp} disabled={loading}>
//                   <Text style={[styles.signUpText, loading && styles.disabledText]}>
//                     Sign up
//                   </Text>
//                 </TouchableOpacity>
//               </Text>
//             </View>

//             <View style={styles.bottomIndicator} />
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </GradientBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'transparent',
//   },
//   keyboardAvoid: { flex: 1 },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: spacing.xl,
//     paddingTop: spacing.xl,
//     paddingBottom: spacing.md,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: spacing.xl,
//   },
//   logoContainer: {
//     marginBottom: spacing.md,
//   },
//   logo: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: '#fff',
//     textAlign: 'center',
//     marginVertical: spacing.md,
//   },
//   socialButtonContainer: {
//     marginBottom: spacing.xl,
//   },
//   googleButton: {
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//     marginBottom: 10,
//   },
//   googleButtonText: {
//     marginLeft: 12,
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: spacing.xl,
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//   },
//   dividerText: {
//     color: '#fff',
//     marginHorizontal: spacing.md,
//     fontSize: 14,
//   },
//   form: {
//     marginBottom: spacing.xl,
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//     marginBottom: 6,
//   },
//   input: {
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderRadius: 12,
//     fontSize: 16,
//     color: '#fff',
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.2)',
//   },
//   signInButton: {
//     backgroundColor: colors.primary,
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   footer: {
//     alignItems: 'center',
//     marginTop: 'auto',
//     paddingVertical: spacing.lg,
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#fff',
//   },
//   signUpText: {
//     color: '#fff',
//     fontWeight: '600',
//     textDecorationLine: 'underline',
//   },
//   bottomIndicator: {
//     width: 60,
//     height: 5,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     borderRadius: 3,
//     alignSelf: 'center',
//     marginTop: spacing.md,
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
//   disabledText: {
//     opacity: 0.6,
//   },
// });



import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing } from '../../theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GradientBackground } from '../../components/GradientBackground';
import { useAuth } from '../../contexts/AuthContext';

interface SignInScreenProps {
  navigation: any;
}

export const SignInScreen = ({ navigation }: SignInScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { signInWithGoogle, signInWithEmail, loading } = useAuth();

  const handleSuccessfulLogin = async () => {
    try {
      const isOnboardingComplete = await AsyncStorage.getItem('onboarding_complete');
      
      if (isOnboardingComplete === 'true') {
        navigation.navigate('Home');
      } else {
        navigation.navigate('Questionnaire');
      }
    } catch (error) {
      console.error('Error handling login:', error);
      navigation.navigate('Questionnaire');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        await handleSuccessfulLogin();
      } else {
        Alert.alert('Sign In Failed', result.error || 'Google sign-in failed');
      }
    } catch (error: any) {
      Alert.alert('Sign In Failed', 'An unexpected error occurred during Google sign-in');
    }
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithEmail(email, password);
      
      if (result.success) {
        await handleSuccessfulLogin();
      } else {
        Alert.alert('Sign In Failed', result.error || 'Email sign-in failed');
      }
    } catch (error: any) {
      Alert.alert('Sign In Failed', 'An unexpected error occurred during email sign-in');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp' as never);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logo} />
              </View>
              <Text style={styles.title}>Sign in to continue</Text>
            </View>

            <View style={styles.socialButtonContainer}>
              <TouchableOpacity
                style={[styles.googleButton, loading && styles.disabledButton]}
                onPress={handleGoogleSignIn}
                disabled={loading}
              >
                <FontAwesome name="google" size={20} color="#DB4437" />
                <Text style={styles.googleButtonText}>
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or continue with email</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255,255,255,0.7)"
                  secureTextEntry
                  editable={!loading}
                />
              </View>

              <TouchableOpacity 
                style={[styles.signInButton, loading && styles.disabledButton]} 
                onPress={handleSignIn}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <TouchableOpacity onPress={handleSignUp} disabled={loading}>
                  <Text style={[styles.signUpText, loading && styles.disabledText]}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>

            <View style={styles.bottomIndicator} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboardAvoid: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  socialButtonContainer: {
    marginBottom: spacing.xl,
  },
  googleButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  googleButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    color: '#fff',
    marginHorizontal: spacing.md,
    fontSize: 14,
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  signInButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
  },
  signUpText: {
    color: '#fff',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  bottomIndicator: {
    width: 60,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.6,
  },
});