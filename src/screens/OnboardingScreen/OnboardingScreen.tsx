
// import React, { useEffect, useState } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   SafeAreaView,
//   ActivityIndicator,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation, NavigationProp } from '@react-navigation/native';
// import { Button, GradientBackground } from '../../components';
// import { colors, spacing, typography } from '../../theme';
// import { RootStackParamList } from '../../navigation/AppNavigator';

// type OnboardingNavigationProp = NavigationProp<RootStackParamList, 'Onboarding'>;

// export const OnboardingScreen = () => {
//   const navigation = useNavigation<OnboardingNavigationProp>();
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Check login status when component mounts
//   useEffect(() => {
//     checkLoginStatus();
//   }, []);

//   const checkLoginStatus = async () => {
//     try {
//       const userToken = await AsyncStorage.getItem('userToken');
//       setIsLoggedIn(!!userToken);
//     } catch (error) {
//       console.error('⚠️ Failed to get login status:', error);
//       setIsLoggedIn(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGetStarted = async () => {
//     try {
//       if (isLoggedIn) {
//         navigation.navigate('Home');
//       } else {
//         navigation.navigate('SignIn');
//       }
//     } catch (error) {
//       console.error('Error during navigation:', error);
//       navigation.navigate(isLoggedIn ? 'Home' : 'SignIn');
//     }
//   };

//   if (isLoading) {
//     return (
//       <GradientBackground>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={colors.primary} />
//           <Text style={styles.loadingText}>Preparing your experience...</Text>
//         </View>
//       </GradientBackground>
//     );
//   }

//   return (
//     <GradientBackground>
//       <SafeAreaView style={styles.container}>
//         <View style={styles.content}>
//           <View style={styles.logoContainer}>
//             <View style={styles.logoCircle} />
//           </View>

//           <View style={styles.textContainer}>
//             <Text style={styles.title}>Welcome to Connect</Text>
//             <Text style={styles.subtitle}>
//               {isLoggedIn
//                 ? "Welcome back! Ready to continue your journey?"
//                 : 'Your journey begins here. Let\'s get you signed in!'}
//             </Text>
//           </View>

//           <Button
//             title={isLoggedIn ? 'Go to Home' : 'Sign In'}
//             onPress={handleGetStarted}
//             style={styles.button}
//           />
//         </View>

//         <View style={styles.bottomIndicator} />
//       </SafeAreaView>
//     </GradientBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1 
//   },
//   loadingContainer: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center' 
//   },
//   loadingText: { 
//     marginTop: spacing.sm, 
//     fontSize: 16, 
//     color: colors.text.primary 
//   },
//   content: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: spacing.xl,
//     paddingTop: '30%',
//     paddingBottom: spacing.xxl,
//   },
//   logoContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logoCircle: { 
//     width: 80, 
//     height: 80, 
//     borderRadius: 40, 
//     backgroundColor: 'white' 
//   },
//   textContainer: { 
//     alignItems: 'center', 
//     marginVertical: spacing.xxl 
//   },
//   title: { 
//     ...typography.h1, 
//     color: colors.text.white, 
//     marginBottom: spacing.sm, 
//     textAlign: 'center' 
//   },
//   subtitle: { 
//     ...typography.body, 
//     color: colors.text.white, 
//     opacity: 0.8, 
//     textAlign: 'center', 
//     lineHeight: 22 
//   },
//   button: { 
//     width: '100%', 
//     marginBottom: spacing.xl 
//   },
//   bottomIndicator: { 
//     width: 60, 
//     height: 5, 
//     backgroundColor: 'white', 
//     borderRadius: 3, 
//     alignSelf: 'center', 
//     marginBottom: spacing.md 
//   },
// });

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { Button, GradientBackground } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { RootStackParamList } from '../../navigation/AppNavigator';

type OnboardingNavigationProp = NavigationProp<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check login status when component mounts AND when screen comes into focus
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Re-check when screen comes into focus (like after logout)
  useFocusEffect(
    React.useCallback(() => {
      checkLoginStatus();
    }, [])
  );

  const checkLoginStatus = async () => {
    setIsLoading(true);
    try {
      // Clear any potentially stale data first
      const userToken = await AsyncStorage.getItem('userToken');
      const isLoggedInStored = await AsyncStorage.getItem('isLoggedIn');
      
      console.log('🔍 Checking login status:');
      console.log('userToken:', userToken);
      console.log('isLoggedInStored:', isLoggedInStored);
      
      // Check both userToken and the stored login status
      const hasValidToken = userToken && userToken.trim() !== '' && userToken !== 'null';
      const storedLoginStatus = isLoggedInStored === 'true';
      
      // User is logged in only if BOTH conditions are true
      const loginStatus = hasValidToken && storedLoginStatus;
      
      console.log('Final login status:', loginStatus);
      setIsLoggedIn(loginStatus);
      
    } catch (error) {
      console.error('⚠️ Failed to get login status:', error);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStarted = async () => {
    try {
      // Double-check login status before navigation
      await checkLoginStatus();
      
      if (isLoggedIn) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('SignIn');
      }
    } catch (error) {
      console.error('Error during navigation:', error);
      // If there's any error, always go to SignIn for safety
      navigation.navigate('SignIn');
    }
  };

  if (isLoading) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Preparing your experience...</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to Connect</Text>
            <Text style={styles.subtitle}>
              {isLoggedIn
                ? "Welcome back! Ready to continue your journey?"
                : 'Your journey begins here. Let\'s get you signed in!'}
            </Text>
          </View>

          <Button
            title={isLoggedIn ? 'Go to Home' : 'Get Started'}
            onPress={handleGetStarted}
            style={styles.button}
          />
        </View>

        <View style={styles.bottomIndicator} />
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: spacing.sm, 
    fontSize: 16, 
    color: colors.text.primary 
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: '30%',
    paddingBottom: spacing.xxl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: 'white' 
  },
  textContainer: { 
    alignItems: 'center', 
    marginVertical: spacing.xxl 
  },
  title: { 
    ...typography.h1, 
    color: colors.text.white, 
    marginBottom: spacing.sm, 
    textAlign: 'center' 
  },
  subtitle: { 
    ...typography.body, 
    color: colors.text.white, 
    opacity: 0.8, 
    textAlign: 'center', 
    lineHeight: 22 
  },
  button: { 
    width: '100%', 
    marginBottom: spacing.xl 
  },
  bottomIndicator: { 
    width: 60, 
    height: 5, 
    backgroundColor: 'white', 
    borderRadius: 3, 
    alignSelf: 'center', 
    marginBottom: spacing.md 
  },
});