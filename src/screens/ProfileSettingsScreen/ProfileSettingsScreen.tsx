import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

interface ProfileSettingsScreenProps {
  navigation: any;
}

interface UserPreferences {
  mood: string;
  energyLevel: number;
  personType: string;
  environment: string;
  avatar: number;
  botName: string;
}

// Static image imports
const avatarImages = [
  require('../../../assets/images/1.jpg'),
  require('../../../assets/images/2.jpg'),
  require('../../../assets/images/3.jpg'),
  require('../../../assets/images/4.jpg'),
];

export const ProfileSettingsScreen = ({
  navigation,
}: ProfileSettingsScreenProps) => {
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Get avatar image based on index
  const getAvatarImage = (index: number) => {
    if (index >= 0 && index < avatarImages.length) {
      return avatarImages[index];
    }
    return avatarImages[0]; // Default to first avatar
  };

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefData = await AsyncStorage.getItem('user_preferences');
        if (prefData) {
          setUserPreferences(JSON.parse(prefData));
        }
        setLoading(false);
      } catch (error) {
        console.log('Error loading preferences:', error);
        setLoading(false);
      }
    };

    loadPreferences();
  }, []);

  const handleResetPreferences = () => {
    Alert.alert(
      'Reset Preferences',
      'Are you sure you want to reset your preferences? This will take you back to the questionnaire.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove all relevant data from AsyncStorage
              await AsyncStorage.removeItem('user_preferences');
              await AsyncStorage.removeItem('onboarding_complete');
              await AsyncStorage.removeItem('chat_messages');

              // Navigate to questionnaire
              navigation.reset({
                index: 0,
                routes: [{ name: 'Questionnaire' }],
              });
            } catch (error) {
              console.log('Error resetting preferences:', error);
              Alert.alert(
                'Error',
                'Failed to reset preferences. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userPreferences) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>No preferences found</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => navigation.navigate('Questionnaire')}
          >
            <Text style={styles.resetButtonText}>Go to Questionnaire</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#00BFFF', '#FF69B4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile Settings</Text>
          <View style={{ width: 24 }} /> {/* Empty view for balance */}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={
              userPreferences.avatar >= 0
                ? getAvatarImage(userPreferences.avatar)
                : avatarImages[0]
            }
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>
            {userPreferences.botName || 'AI Companion'}
          </Text>
        </View>

        {/* Preferences Section */}
        <View style={styles.preferencesContainer}>
          <Text style={styles.sectionTitle}>Your Preferences</Text>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Bot Name</Text>
            <Text style={styles.preferenceValue}>
              {userPreferences.botName || 'Not set'}
            </Text>
          </View>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Mood</Text>
            <Text style={styles.preferenceValue}>
              {userPreferences.mood || 'Not set'}
            </Text>
          </View>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Energy Level</Text>
            <View style={styles.energyBarContainer}>
              <View style={styles.energyBar}>
                <View
                  style={[
                    styles.energyFill,
                    { width: `${userPreferences.energyLevel || 0}%` },
                  ]}
                />
              </View>
              <Text style={styles.energyValue}>
                {(userPreferences.energyLevel || 0).toFixed(1)}%
              </Text>
            </View>
          </View>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Person Type</Text>
            <Text style={styles.preferenceValue}>
              {userPreferences.personType || 'Not set'}
            </Text>
          </View>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Environment</Text>
            <Text style={styles.preferenceValue}>
              {userPreferences.environment || 'Not set'}
            </Text>
          </View>

          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Avatar</Text>
            <Text style={styles.preferenceValue}>
              Avatar #{userPreferences.avatar + 1 || 1}
            </Text>
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetPreferences}
        >
          <Text style={styles.resetButtonText}>Reset Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  header: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: spacing.md,
  },
  profileName: {
    ...typography.h2,
    color: colors.text.primary,
  },
  preferencesContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text.primary,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: spacing.sm,
  },
  preferenceItem: {
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  preferenceLabel: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  preferenceValue: {
    ...typography.subtitle,
    color: colors.text.primary,
  },
  energyBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  energyBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: spacing.sm,
  },
  energyFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  energyValue: {
    width: 40,
    textAlign: 'right',
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#ff4757',
    borderRadius: 10,
    padding: spacing.md,
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
