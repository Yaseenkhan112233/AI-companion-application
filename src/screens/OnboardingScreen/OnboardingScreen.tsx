import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { Button, GradientBackground } from '../../components';
import { colors, spacing, typography } from '../../theme';

interface OnboardingScreenProps {
  navigation: any;
}

export const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
  const handleGetStarted = () => {
    navigation.navigate('SignIn');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to Connect</Text>
            <Text style={styles.subtitle}>Your journey begins here</Text>
          </View>

          <Button
            title="Get Started"
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
