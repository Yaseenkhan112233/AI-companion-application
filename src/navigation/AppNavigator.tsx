


import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { openAppAdManager } from '../services/OpenAppAdManager';
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
  ProfileSettings: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Onboarding');

  useEffect(() => {
    checkAuthStatus();
    
    // Cleanup ads when component unmounts
    return () => {
      openAppAdManager.destroy();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is logged in
      const userToken = await AsyncStorage.getItem('userToken');
      const isLoggedIn = !!userToken;
      
      // Always start with onboarding, but store login status for later navigation
      await AsyncStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
      
      // Always set initial route to Onboarding
      setInitialRoute('Onboarding');
      
    } catch (error) {
      console.error('Error checking auth status:', error);
      // If there's an error, default to onboarding
      setInitialRoute('Onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while checking auth status
  if (isLoading) {
    return null; // You can replace this with a loading component
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
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
