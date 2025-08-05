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
// } from 'react-native';
// import { Button, Input, SocialButton } from '../../components';
// import { colors, spacing, typography, radius } from '../../theme';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// interface SignInScreenProps {
//   navigation: any;
// }

// export const SignInScreen = ({ navigation }: SignInScreenProps) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleGoogleSignIn = () => {
//     // In the future, this will handle Google sign-in logic
//     console.log('Google sign-in');
//     navigation.navigate('Questionnaire');
//   };

//   const handleSignIn = () => {
//     // In the future, this will handle sign-in logic
//     console.log('Sign in with:', email, password);
//     navigation.navigate('Questionnaire');
//   };

//   const handleSignUp = () => {
//     // In the future, this will navigate to sign up screen
//     console.log('Navigate to sign up');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardAvoid}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.header}>
//             <View style={styles.logoContainer}>
//               <View style={styles.logo} />
//             </View>
//             <Text style={styles.title}>Sign in to continue</Text>
//           </View>

//           <View style={styles.socialButtonContainer}>
//             <SocialButton
//               title="Continue with Google"
//               onPress={handleGoogleSignIn}
//               icon={<Text style={{ color: colors.primary }}>G</Text>}
//             />
//           </View>

//           <View style={styles.dividerContainer}>
//             <View style={styles.divider} />
//             <Text style={styles.dividerText}>Or continue with email</Text>
//             <View style={styles.divider} />
//           </View>

//           <View style={styles.form}>
//             <Input
//               value={email}
//               onChangeText={setEmail}
//               placeholder="Enter your email"
//               keyboardType="email-address"
//             />
//             <Input
//               value={password}
//               onChangeText={setPassword}
//               placeholder="Enter your password"
//               secureTextEntry
//             />

//             <Button
//               title="Sign In"
//               onPress={handleSignIn}
//               variant="gradient"
//               style={styles.signInButton}
//               titleStyle={styles.buttonText}
//               fullWidth
//             />
//           </View>

//           <View style={styles.footer}>
//             <Text style={styles.footerText}>
//               Don't have an account?{' '}
//               <Text style={styles.signUpText} onPress={handleSignUp}>
//                 Sign up
//               </Text>
//             </Text>
//           </View>

//           <View style={styles.bottomIndicator} />
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   keyboardAvoid: {
//     flex: 1,
//   },
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
//     backgroundColor: colors.primary,
//   },
//   title: {
//     ...typography.h2,
//     marginVertical: spacing.md,
//   },
//   socialButtonContainer: {
//     marginBottom: spacing.xl,
//   },
//   dividerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: spacing.xl,
//   },
//   divider: {
//     flex: 1,
//     height: 1,
//     backgroundColor: colors.input.border,
//   },
//   dividerText: {
//     color: colors.text.secondary,
//     marginHorizontal: spacing.md,
//     fontSize: 14,
//   },
//   form: {
//     marginBottom: spacing.xl,
//   },
//   signInButton: {
//     marginTop: spacing.lg,
//   },
//   buttonText: {
//     color: colors.text.white,
//   },
//   footer: {
//     alignItems: 'center',
//     marginTop: 'auto',
//     paddingVertical: spacing.lg,
//   },
//   footerText: {
//     fontSize: 14,
//     color: colors.text.secondary,
//   },
//   signUpText: {
//     color: colors.primary,
//     fontWeight: '600',
//   },
//   bottomIndicator: {
//     width: 60,
//     height: 5,
//     backgroundColor: '#000',
//     borderRadius: 3,
//     opacity: 0.2,
//     alignSelf: 'center',
//     marginTop: spacing.md,
//   },
// });

import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
  User,
} from '@react-native-google-signin/google-signin';
import { Button, Input, SocialButton } from '../../components';
import { colors, spacing, typography } from '../../theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import auth from '@react-native-firebase/auth';

interface SignInScreenProps {
  navigation: any;
}

export const SignInScreen = ({ navigation }: SignInScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '191123860425-of562ahgj7omb28vpq4b3rm7fdairs98.apps.googleusercontent.com', // From your google-services.json
      offlineAccess: false,
    });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: User = await GoogleSignin.signIn();
      console.log('Google user info:', userInfo);

      // Optional: navigate or save token here
      navigation.navigate('Questionnaire');
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'User cancelled the login flow.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Sign in is in progress already.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Play Services not available.');
      } else {
        Alert.alert('Unknown Error', error.message);
      }
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Please enter both email and password.');
    }

    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('Questionnaire');
    } catch (error: any) {
      console.log('Firebase sign-in error:', error);
      Alert.alert('Login Failed', 'Please enter correct email or password.');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp' as never); // navigate to SignUp screen
  };

  return (
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
            <SocialButton
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              icon={<FontAwesome name="google" size={24} color="#DB4437" />}
            />
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with email</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.form}>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
            <Button
              title="Sign In"
              onPress={handleSignIn}
              variant="gradient"
              style={styles.signInButton}
              titleStyle={styles.buttonText}
              fullWidth
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <TouchableOpacity>
                <Text onPress={handleSignUp} style={styles.signUpText}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </Text>
          </View>

          <View style={styles.bottomIndicator} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  keyboardAvoid: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  header: { alignItems: 'center', marginBottom: spacing.xl },
  logoContainer: { marginBottom: spacing.md },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  title: { ...typography.h2, marginVertical: spacing.md },
  socialButtonContainer: { marginBottom: spacing.xl },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  divider: { flex: 1, height: 1, backgroundColor: colors.input.border },
  dividerText: {
    color: colors.text.secondary,
    marginHorizontal: spacing.md,
    fontSize: 14,
  },
  form: { marginBottom: spacing.xl },
  signInButton: { marginTop: spacing.lg },
  buttonText: { color: colors.text.white },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: spacing.lg,
  },
  footerText: { fontSize: 14, color: colors.text.secondary },
  signUpText: { color: colors.primary, fontWeight: '600' },
  bottomIndicator: {
    width: 60,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 3,
    opacity: 0.2,
    alignSelf: 'center',
    marginTop: spacing.md,
  },
});
