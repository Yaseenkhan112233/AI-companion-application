
import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  AppState,
  AppStateStatus,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Button, GradientBackground } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { openAppAdManager } from '../../services/OpenAppAdManager';
import { RootStackParamList } from '../../navigation/AppNavigator';

type OnboardingNavigationProp = NavigationProp<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const appState = useRef(AppState.currentState);

  // 1️⃣ Check login status and show ad after cold start
  useEffect(() => {
    const initialize = async () => {
      await checkLoginStatus();

      setTimeout(() => {
        openAppAdManager.showAdIfAvailable(() => {
          console.log('📪 Open App Ad dismissed (initial launch)');
        });
      }, 1000);
    };

    initialize();
  }, []);

  // 2️⃣ Listen to app state changes (foreground detection)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('📲 App has come to the foreground');
      openAppAdManager.showAdIfAvailable(() => {
        console.log('📪 Open App Ad dismissed (on resume)');
      });
    }
    appState.current = nextAppState;
  };

  const checkLoginStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(status ? JSON.parse(status) : false);
    } catch (error) {
      console.error('⚠️ Failed to get login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetStarted = () => {
    navigation.navigate(isLoggedIn ? 'Home' : 'SignIn');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Preparing your experience...</Text>
      </View>
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
                ? "Welcome back! Let's continue where you left off."
                : 'Your journey begins here.'}
            </Text>
          </View>

          <Button
            title={isLoggedIn ? 'Continue' : 'Get Started'}
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
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: 16,
    color: colors.text.primary,
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
    backgroundColor: 'white',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.white,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.white,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  bottomIndicator: {
    width: 60,
    height: 5,
    backgroundColor: 'white',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
});

