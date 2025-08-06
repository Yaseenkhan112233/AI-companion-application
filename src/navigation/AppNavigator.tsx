import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  OnboardingScreen,
  SignInScreen,
  QuestionnaireScreen,
  HomeScreen,
  ProfileSettingsScreen,
} from '../screens';
import SignUpScreen from '../screens/SignupScreen/SignupScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  SignIn: undefined;
  Questionnaire: undefined;
  Home: undefined;
  Main: undefined;
  ProfileSettings: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="ProfileSettings"
          component={ProfileSettingsScreen}
        />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import auth from '@react-native-firebase/auth';

// import {
//   OnboardingScreen,
//   SignInScreen,
//   QuestionnaireScreen,
//   HomeScreen,
//   ProfileSettingsScreen,
// } from '../screens';
// import SignUpScreen from '../screens/SignupScreen/SignupScreen';

// export type RootStackParamList = {
//   Onboarding: undefined;
//   SignIn: undefined;
//   SignUp: undefined;
//   Questionnaire: undefined;
//   Home: undefined;
//   ProfileSettings: undefined;
//   AuthCheck: undefined;
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// export const AppNavigator = () => {
//   const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Onboarding');

//   useEffect(() => {
//     const checkAuth = async () => {
//       const onboarded = await AsyncStorage.getItem('hasOnboarded');
//       const user = auth().currentUser;

//       if (!onboarded) {
//         setInitialRoute('Onboarding');
//       } else if (user) {
//         // User is signed in — but have they completed the questionnaire?
//         const completed = await AsyncStorage.getItem('questionnaireCompleted');
//         if (completed === 'true') {
//           setInitialRoute('Home');
//         } else {
//           setInitialRoute('Questionnaire');
//         }
//       } else {
//         setInitialRoute('SignIn');
//       }
//     };

//     checkAuth();

//     // Optional: Listen for auth changes
//     const unsubscribe = auth().onAuthStateChanged(() => {
//       // You can update navigation here if needed
//     });

//     return unsubscribe;
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Onboarding" component={OnboardingScreen} />
//         <Stack.Screen name="SignIn" component={SignInScreen} />
//         <Stack.Screen name="SignUp" component={SignUpScreen} />
//         <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

