

// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Image,
//   Dimensions,
//   PanResponder,
//   Animated,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { colors, spacing, typography, radius } from '../../theme';
// import LinearGradient from 'react-native-linear-gradient';

// interface QuestionnaireScreenProps {
//   navigation: any;
// }

// type QuestionType =
//   | 'mood'
//   | 'energy'
//   | 'personType'
//   | 'environment'
//   | 'avatar'
//   | 'name';

// const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

// export const QuestionnaireScreen = ({
//   navigation,
// }: QuestionnaireScreenProps) => {
//   // Track which questions have been answered
//   const [answeredQuestions, setAnsweredQuestions] = useState<QuestionType[]>(
//     [],
//   );
//   const totalQuestions = 6; // Including name

//   const [mood, setMood] = useState('');
//   const [energyLevel, setEnergyLevel] = useState(50);
//   const [personType, setPersonType] = useState('');
//   const [environment, setEnvironment] = useState('');
//   const [selectedAvatar, setSelectedAvatar] = useState(-1);
//   const [avatarName, setAvatarName] = useState('');

//   // Check if all questions are answered
//   const allQuestionsAnswered = answeredQuestions.length === totalQuestions;

//   // Pan handler for energy level slider
//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onMoveShouldSetPanResponder: () => true,
//     onPanResponderMove: (_, gestureState) => {
//       // Calculate position based on slider width
//       const sliderWidth = Dimensions.get('window').width - spacing.xl * 2;
//       const position = Math.max(
//         0,
//         Math.min(100, (gestureState.moveX / sliderWidth) * 100),
//       );
//       setEnergyLevel(position);
//       updateAnsweredQuestions('energy');
//     },
//   });

//   const moods = [
//     { value: 'Sad', icon: '☹️' },
//     { value: 'Neutral', icon: '😐' },
//     { value: 'Good', icon: '🙂' },
//     { value: 'Happy', icon: '😄' },
//     { value: 'Amazing', icon: '😊' },
//   ];

//   // Image assets for avatars
//   const avatarImages = [
//     require('../../../assets/images/1.jpg'),
//     require('../../../assets/images/2.jpg'),
//     require('../../../assets/images/3.jpg'),
//     require('../../../assets/images/4.jpg'),
//   ];

//   // Check if onboarding has been completed before
//   useEffect(() => {
//     const checkOnboardingStatus = async () => {
//       try {
//         const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
//         if (value === 'true') {
//           // Navigate to home screen if onboarding is already completed
//           navigation.replace('Home');
//         }
//       } catch (error) {
//         console.log('Error checking onboarding status:', error);
//       }
//     };

//     checkOnboardingStatus();
//   }, [navigation]);

//   const updateAnsweredQuestions = (question: QuestionType) => {
//     if (!answeredQuestions.includes(question)) {
//       setAnsweredQuestions(prev => [...prev, question]);
//     }
//   };

//   const handleMoodChange = (newMood: string) => {
//     setMood(newMood);
//     updateAnsweredQuestions('mood');
//   };

//   const handlePersonTypeChange = (type: string) => {
//     setPersonType(type);
//     updateAnsweredQuestions('personType');
//   };

//   const handleEnvironmentChange = (env: string) => {
//     setEnvironment(env);
//     updateAnsweredQuestions('environment');
//   };

//   const handleAvatarChange = (index: number) => {
//     setSelectedAvatar(index);
//     updateAnsweredQuestions('avatar');
//   };

//   const handleNameChange = (name: string) => {
//     setAvatarName(name);
//     if (name.trim() !== '') {
//       updateAnsweredQuestions('name');
//     }
//   };

//   const handleNext = async () => {
//     if (!allQuestionsAnswered) return;

//     try {
//       // Save user preferences to local storage
//       const userPreferences = {
//         mood,
//         energyLevel,
//         personType,
//         environment,
//         avatar: selectedAvatar,
//         botName: avatarName,
//       };

//       await AsyncStorage.setItem(
//         'user_preferences',
//         JSON.stringify(userPreferences),
//       );
//       await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');

//       // Navigate to home screen after storing preferences
//       navigation.replace('Home');
//     } catch (error) {
//       console.log('Error saving preferences:', error);
//     }
//   };

//   const handleBack = () => {
//     navigation.goBack();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Progress bar */}
//         <View style={styles.progressContainer}>
//           <LinearGradient
//             colors={['#FF66CC', '#6666FF']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={[
//               styles.progressBar,
//               {
//                 width: `${(answeredQuestions.length / totalQuestions) * 100}%`,
//               },
//             ]}
//           />
//           <Text style={styles.progressText}>
//             {answeredQuestions.length > 0
//               ? `Question ${answeredQuestions.length} of ${totalQuestions}`
//               : ''}
//           </Text>
//         </View>

//         {/* Mood Selection */}
//         <View style={styles.questionContainer}>
//           <Text style={styles.questionTitle}>How are you feeling today?</Text>
//           <View style={styles.moodContainer}>
//             {moods.map(item => (
//               <TouchableOpacity
//                 key={item.value}
//                 style={[
//                   styles.moodOption,
//                   mood === item.value && styles.moodOptionSelected,
//                 ]}
//                 onPress={() => handleMoodChange(item.value)}
//               >
//                 <Text style={styles.moodIcon}>{item.icon}</Text>
//                 <Text style={styles.moodText}>{item.value}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Energy Level */}
//         <View style={styles.questionContainer}>
//           <Text style={styles.questionTitle}>
//             What's your energy level right now?
//           </Text>
//           <View style={styles.sliderContainer}>
//             <View style={styles.sliderLabels}>
//               <Text style={styles.sliderLabel}>Low</Text>
//               <Text style={styles.sliderLabel}>High</Text>
//             </View>
//             <View
//               style={styles.volumeSliderContainer}
//               {...panResponder.panHandlers}
//             >
//               <LinearGradient
//                 colors={['#00BFFF', '#FF69B4']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 style={styles.slider}
//               />
//               <View style={[styles.volumeKnob, { left: `${energyLevel}%` }]} />
//             </View>
//             <View style={styles.volumeIndicators}>
//               <View
//                 style={[
//                   styles.volumeBar,
//                   { height: Math.max(4, energyLevel * 0.05) },
//                 ]}
//               />
//               <View
//                 style={[
//                   styles.volumeBar,
//                   { height: Math.max(4, energyLevel * 0.1) },
//                 ]}
//               />
//               <View
//                 style={[
//                   styles.volumeBar,
//                   { height: Math.max(4, energyLevel * 0.15) },
//                 ]}
//               />
//               <View
//                 style={[
//                   styles.volumeBar,
//                   { height: Math.max(4, energyLevel * 0.2) },
//                 ]}
//               />
//               <View
//                 style={[
//                   styles.volumeBar,
//                   { height: Math.max(4, energyLevel * 0.25) },
//                 ]}
//               />
//             </View>
//           </View>
//         </View>

//         {/* Person Type */}
//         <View style={styles.questionContainer}>
//           <Text style={styles.questionTitle}>Are you more of a...</Text>
//           <View style={styles.optionRow}>
//             <TouchableOpacity
//               style={[
//                 styles.option,
//                 personType === 'Morning Person' && styles.optionSelected,
//                 {
//                   backgroundColor:
//                     personType === 'Morning Person' ? '#FF66CC' : '#FFFFFF',
//                 },
//               ]}
//               onPress={() => handlePersonTypeChange('Morning Person')}
//             >
//               <Text style={styles.optionIcon}>☀️</Text>
//               <Text
//                 style={[
//                   styles.optionText,
//                   personType === 'Morning Person' && styles.optionTextSelected,
//                 ]}
//               >
//                 Morning Person
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.option,
//                 personType === 'Night Owl' && styles.optionSelected,
//               ]}
//               onPress={() => handlePersonTypeChange('Night Owl')}
//             >
//               <Text style={styles.optionIcon}>🌙</Text>
//               <Text style={styles.optionText}>Night Owl</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Environment */}
//         <View style={styles.questionContainer}>
//           <Text style={styles.questionTitle}>
//             Select your preferred environment
//           </Text>
//           <View style={styles.optionRow}>
//             <TouchableOpacity
//               style={[
//                 styles.environmentOption,
//                 environment === 'Outdoors' && styles.environmentOptionSelected,
//               ]}
//               onPress={() => handleEnvironmentChange('Outdoors')}
//             >
//               <View style={styles.environmentPlain}>
//                 <Text style={styles.optionIcon}>🏔️</Text>
//                 <Text style={styles.environmentText}>Outdoor</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.environmentOption,
//                 environment === 'Indoor' && styles.environmentOptionSelected,
//               ]}
//               onPress={() => handleEnvironmentChange('Indoor')}
//             >
//               <View style={styles.environmentPlain}>
//                 <Text style={styles.optionIcon}>🏠</Text>
//                 <Text style={styles.environmentText}>Indoor</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[
//                 styles.environmentOption,
//                 environment === 'Both' && styles.environmentOptionSelected,
//               ]}
//               onPress={() => handleEnvironmentChange('Both')}
//             >
//               <View style={styles.environmentPlain}>
//                 <Text style={styles.optionIcon}>🌱</Text>
//                 <Text style={styles.environmentText}>Both</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Avatar Selection - Horizontal Carousel */}
//         <View style={styles.questionContainer}>
//           <Text style={styles.questionTitle}>Choose Your Avatar</Text>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.avatarCarousel}
//             decelerationRate="fast"
//             snapToInterval={Dimensions.get('window').width * 0.4}
//             snapToAlignment="center"
//           >
//             {avatarImages.map((image, index) => (
//               <TouchableOpacity
//                 key={`avatar-${index}`}
//                 style={[
//                   styles.avatarOption,
//                   selectedAvatar === index && styles.avatarSelected,
//                 ]}
//                 onPress={() => handleAvatarChange(index)}
//               >
//                 <Image source={image} style={styles.avatarImage} />
//               </TouchableOpacity>
//             ))}
//           </ScrollView>

//           {/* Avatar Name Input */}
//           <View style={styles.nameInputContainer}>
//             <TextInput
//               style={styles.nameInput}
//               placeholder="Write your bot name"
//               placeholderTextColor={colors.input.placeholder}
//               value={avatarName}
//               onChangeText={handleNameChange}
//               maxLength={20}
//               textAlign="center"
//             />
//             <Text style={styles.charCount}>{avatarName.length}/20</Text>
//           </View>
//         </View>

//         {/* Navigation Buttons */}
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//             <Text style={styles.backButtonText}>Back</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.nextButton,
//               !allQuestionsAnswered && styles.nextButtonDisabled,
//             ]}
//             onPress={handleNext}
//             disabled={!allQuestionsAnswered}
//           >
//             <LinearGradient
//               colors={
//                 allQuestionsAnswered
//                   ? ['#FF66CC', '#6666FF']
//                   : ['#cccccc', '#aaaaaa']
//               }
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.nextButtonGradient}
//             >
//               <Text style={styles.nextButtonText}>Next</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: spacing.xl,
//     paddingTop: spacing.md,
//     paddingBottom: spacing.xxl,
//   },
//   progressContainer: {
//     marginBottom: spacing.xl,
//     backgroundColor: '#f0f0f0',
//     height: 4,
//     borderRadius: 2,
//     width: '100%',
//   },
//   progressBar: {
//     height: 4,
//     borderRadius: 2,
//     marginBottom: spacing.sm,
//   },
//   progressText: {
//     textAlign: 'center',
//     color: colors.text.secondary,
//     ...typography.bodySmall,
//     marginTop: spacing.xs,
//   },
//   questionContainer: {
//     marginBottom: spacing.xl,
//   },
//   questionTitle: {
//     ...typography.h2,
//     marginBottom: spacing.lg,
//   },
//   moodContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: spacing.md,
//   },
//   moodOption: {
//     alignItems: 'center',
//     padding: spacing.sm,
//     borderRadius: radius.md,
//   },
//   moodOptionSelected: {
//     backgroundColor: colors.primary,
//   },
//   moodIcon: {
//     fontSize: 28,
//     marginBottom: spacing.xs,
//   },
//   moodText: {
//     fontSize: 12,
//     color: colors.text.secondary,
//   },
//   sliderContainer: {
//     marginTop: spacing.md,
//   },
//   sliderLabels: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: spacing.sm,
//   },
//   sliderLabel: {
//     color: colors.text.secondary,
//     fontSize: 14,
//   },
//   volumeSliderContainer: {
//     position: 'relative',
//     height: 20,
//     justifyContent: 'center',
//   },
//   slider: {
//     height: 4,
//     borderRadius: 2,
//     width: '100%',
//   },
//   volumeKnob: {
//     position: 'absolute',
//     width: 20,
//     height: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: colors.primary,
//     transform: [{ translateX: -10 }],
//   },
//   volumeIndicators: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: spacing.sm,
//     paddingHorizontal: spacing.xl,
//   },
//   volumeBar: {
//     width: 4,
//     backgroundColor: colors.text.secondary,
//     borderRadius: 1,
//   },
//   optionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: spacing.md,
//   },
//   option: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: spacing.md,
//     borderRadius: radius.md,
//     borderWidth: 1,
//     borderColor: colors.input.border,
//     marginHorizontal: spacing.xs,
//   },
//   optionSelected: {
//     borderColor: colors.primary,
//   },
//   optionIcon: {
//     fontSize: 24,
//     marginBottom: spacing.sm,
//   },
//   optionText: {
//     fontSize: 14,
//     color: colors.text.secondary,
//   },
//   optionTextSelected: {
//     color: colors.text.white,
//   },
//   environmentOption: {
//     flex: 1,
//     height: 100,
//     marginHorizontal: spacing.xs,
//     borderRadius: radius.md,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: colors.input.border, // Default gray border
//   },
//   environmentOptionSelected: {
//     borderColor: colors.primary, // Blue border when selected
//   },
//   environmentPlain: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'white',
//     padding: spacing.md,
//   },
//   environmentText: {
//     fontSize: 14,
//     marginTop: spacing.xs,
//     color: colors.text.secondary,
//   },
//   avatarCarousel: {
//     paddingVertical: spacing.md,
//     paddingHorizontal: spacing.xs,
//   },
//   avatarOption: {
//     width: Dimensions.get('window').width * 0.35,
//     height: Dimensions.get('window').width * 0.35,
//     borderRadius: radius.md,
//     borderWidth: 2,
//     borderColor: 'transparent',
//     overflow: 'hidden',
//     marginHorizontal: spacing.sm,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   avatarSelected: {
//     borderColor: colors.primary,
//     transform: [{ scale: 1.05 }],
//   },
//   avatarImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//   },
//   nameInputContainer: {
//     marginTop: spacing.xl,
//     position: 'relative',
//     paddingHorizontal: spacing.xl,
//   },
//   nameInput: {
//     borderWidth: 0,
//     borderBottomWidth: 1,
//     borderColor: colors.input.border,
//     paddingVertical: spacing.md,
//     color: colors.text.primary,
//     ...typography.body,
//   },
//   charCount: {
//     position: 'absolute',
//     right: spacing.xl,
//     bottom: 10,
//     fontSize: 12,
//     color: colors.text.secondary,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: spacing.xl,
//   },
//   backButton: {
//     paddingVertical: spacing.md,
//     paddingHorizontal: spacing.xl,
//     borderRadius: 50,
//     borderWidth: 1,
//     borderColor: colors.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '40%',
//   },
//   backButtonText: {
//     color: colors.primary,
//     fontWeight: '600',
//   },
//   nextButton: {
//     width: '40%',
//     borderRadius: 50,
//     overflow: 'hidden',
//   },
//   nextButtonDisabled: {
//     opacity: 0.7,
//   },
//   nextButtonGradient: {
//     paddingVertical: spacing.md,
//     paddingHorizontal: spacing.xl,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   nextButtonText: {
//     color: colors.text.white,
//     fontWeight: '600',
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  PanResponder,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, radius } from '../../theme';
import LinearGradient from 'react-native-linear-gradient';

interface QuestionnaireScreenProps {
  navigation: any;
}

type QuestionType =
  | 'mood'
  | 'energy'
  | 'personType'
  | 'environment'
  | 'avatar'
  | 'name';

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete';

export const QuestionnaireScreen = ({ navigation }: QuestionnaireScreenProps) => {
  const [answeredQuestions, setAnsweredQuestions] = useState<QuestionType[]>([]);
  const totalQuestions = 6; 

  const [mood, setMood] = useState('');
  const [energyLevel, setEnergyLevel] = useState(50);
  const [personType, setPersonType] = useState('');
  const [environment, setEnvironment] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(-1);
  const [avatarName, setAvatarName] = useState('');

  const allQuestionsAnswered = answeredQuestions.length === totalQuestions;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const sliderWidth = Dimensions.get('window').width - spacing.xl * 2;
      const position = Math.max(
        0,
        Math.min(100, (gestureState.moveX / sliderWidth) * 100),
      );
      setEnergyLevel(position);
      updateAnsweredQuestions('energy');
    },
  });

  const moods = [
    { value: 'Sad', icon: '☹️' },
    { value: 'Neutral', icon: '😐' },
    { value: 'Good', icon: '🙂' },
    { value: 'Happy', icon: '😄' },
    { value: 'Amazing', icon: '😊' },
  ];

  const avatarImages = [
    require('../../../assets/images/1.jpg'),
    require('../../../assets/images/2.jpg'),
    require('../../../assets/images/3.jpg'),
    require('../../../assets/images/4.jpg'),
  ];

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
        if (value === 'true') {
          navigation.replace('Home');
        }
      } catch (error) {
        console.log('Error checking onboarding status:', error);
      }
    };
    checkOnboardingStatus();
  }, [navigation]);

  const updateAnsweredQuestions = (question: QuestionType) => {
    if (!answeredQuestions.includes(question)) {
      setAnsweredQuestions(prev => [...prev, question]);
    }
  };

  const handleMoodChange = (newMood: string) => {
    setMood(newMood);
    updateAnsweredQuestions('mood');
  };

  const handlePersonTypeChange = (type: string) => {
    setPersonType(type);
    updateAnsweredQuestions('personType');
  };

  const handleEnvironmentChange = (env: string) => {
    setEnvironment(env);
    updateAnsweredQuestions('environment');
  };

  const handleAvatarChange = (index: number) => {
    setSelectedAvatar(index);
    updateAnsweredQuestions('avatar');
  };

  const handleNameChange = (name: string) => {
    setAvatarName(name);
    if (name.trim() !== '') {
      updateAnsweredQuestions('name');
    }
  };

  const handleNext = async () => {
    if (!allQuestionsAnswered) return;
  
    try {
      const userPreferences = {
        mood,
        energyLevel,
        personType,
        environment,
        avatar: selectedAvatar,
        botName: avatarName,
        // createdAt: fire.FieldValue.serverTimestamp(),
      };

      await AsyncStorage.setItem(
        'user_preferences',
        JSON.stringify(userPreferences),
      );
      await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');

      // Navigate to home screen after storing preferences
      navigation.replace('Home');
    } catch (error) {
      console.log('Error saving preferences:', error);
    }
  };
  

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress */}
        <View style={styles.progressContainer}>
          <LinearGradient
            colors={['#FF66CC', '#6666FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressBar,
              { width: `${(answeredQuestions.length / totalQuestions) * 100}%` },
            ]}
          />
          <Text style={styles.progressText}>
            {answeredQuestions.length > 0
              ? `Question ${answeredQuestions.length} of ${totalQuestions}`
              : ''}
          </Text>
        </View>

        {/* Mood */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>How are you feeling today?</Text>
          <View style={styles.moodContainer}>
            {moods.map(item => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.moodOption,
                  mood === item.value && styles.moodOptionSelected,
                ]}
                onPress={() => handleMoodChange(item.value)}
              >
                <Text style={styles.moodIcon}>{item.icon}</Text>
                <Text style={styles.moodText}>{item.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Energy */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>What's your energy level right now?</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Low</Text>
              <Text style={styles.sliderLabel}>High</Text>
            </View>
            <View style={styles.volumeSliderContainer} {...panResponder.panHandlers}>
              <LinearGradient
                colors={['#00BFFF', '#FF69B4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.slider}
              />
              <View style={[styles.volumeKnob, { left: `${energyLevel}%` }]} />
            </View>
          </View>
        </View>

        {/* Person Type */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>Are you more of a...</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[
                styles.option,
                personType === 'Morning Person' && styles.optionSelected,
                { backgroundColor: personType === 'Morning Person' ? '#FF66CC' : '#FFF' },
              ]}
              onPress={() => handlePersonTypeChange('Morning Person')}
            >
              <Text style={styles.optionIcon}>☀️</Text>
              <Text
                style={[
                  styles.optionText,
                  personType === 'Morning Person' && styles.optionTextSelected,
                ]}
              >
                Morning Person
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.option,
                personType === 'Night Owl' && styles.optionSelected,
              ]}
              onPress={() => handlePersonTypeChange('Night Owl')}
            >
              <Text style={styles.optionIcon}>🌙</Text>
              <Text style={styles.optionText}>Night Owl</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Environment */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>Select your preferred environment</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[
                styles.environmentOption,
                environment === 'Outdoors' && styles.environmentOptionSelected,
              ]}
              onPress={() => handleEnvironmentChange('Outdoors')}
            >
              <View style={styles.environmentPlain}>
                <Text style={styles.optionIcon}>🏔️</Text>
                <Text style={styles.environmentText}>Outdoor</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.environmentOption,
                environment === 'Indoor' && styles.environmentOptionSelected,
              ]}
              onPress={() => handleEnvironmentChange('Indoor')}
            >
              <View style={styles.environmentPlain}>
                <Text style={styles.optionIcon}>🏠</Text>
                <Text style={styles.environmentText}>Indoor</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.environmentOption,
                environment === 'Both' && styles.environmentOptionSelected,
              ]}
              onPress={() => handleEnvironmentChange('Both')}
            >
              <View style={styles.environmentPlain}>
                <Text style={styles.optionIcon}>🌱</Text>
                <Text style={styles.environmentText}>Both</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Avatar */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>Choose Your Avatar</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.avatarCarousel}
            decelerationRate="fast"
            snapToInterval={Dimensions.get('window').width * 0.4}
            snapToAlignment="center"
          >
            {avatarImages.map((image, index) => (
              <TouchableOpacity
                key={`avatar-${index}`}
                style={[
                  styles.avatarOption,
                  selectedAvatar === index && styles.avatarSelected,
                ]}
                onPress={() => handleAvatarChange(index)}
              >
                <Image source={image} style={styles.avatarImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.nameInputContainer}>
            <TextInput
              style={styles.nameInput}
              placeholder="Write your bot name"
              placeholderTextColor={colors.input.placeholder}
              value={avatarName}
              onChangeText={handleNameChange}
              maxLength={20}
              textAlign="center"
            />
            <Text style={styles.charCount}>{avatarName.length}/20</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, !allQuestionsAnswered && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!allQuestionsAnswered}
          >
            <LinearGradient
              colors={
                allQuestionsAnswered ? ['#FF66CC', '#6666FF'] : ['#ccc', '#aaa']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  progressContainer: {
    marginBottom: spacing.xl,
    backgroundColor: '#f0f0f0',
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  progressBar: { height: 4, borderRadius: 2, marginBottom: spacing.sm },
  progressText: {
    textAlign: 'center',
    color: colors.text.secondary,
    ...typography.bodySmall,
    marginTop: spacing.xs,
  },
  questionContainer: { marginBottom: spacing.xl },
  questionTitle: { ...typography.h2, marginBottom: spacing.lg },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  moodOption: { alignItems: 'center', padding: spacing.sm, borderRadius: radius.md },
  moodOptionSelected: { backgroundColor: colors.primary },
  moodIcon: { fontSize: 28, marginBottom: spacing.xs },
  moodText: { fontSize: 12, color: colors.text.secondary },
  sliderContainer: { marginTop: spacing.md },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  sliderLabel: { color: colors.text.secondary, fontSize: 14 },
  volumeSliderContainer: { position: 'relative', height: 20, justifyContent: 'center' },
  slider: { height: 4, borderRadius: 2, width: '100%' },
  volumeKnob: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    transform: [{ translateX: -10 }],
  },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.input.border,
    marginHorizontal: spacing.xs,
  },
  optionSelected: { borderColor: colors.primary },
  optionIcon: { fontSize: 24, marginBottom: spacing.sm },
  optionText: { fontSize: 14, color: colors.text.secondary },
  optionTextSelected: { color: colors.text.white },
  environmentOption: {
    flex: 1,
    height: 100,
    marginHorizontal: spacing.xs,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.input.border,
  },
  environmentOptionSelected: { borderColor: colors.primary },
  environmentPlain: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', padding: spacing.md },
  environmentText: { fontSize: 14, marginTop: spacing.xs, color: colors.text.secondary },
  avatarCarousel: { paddingVertical: spacing.md, paddingHorizontal: spacing.xs },
  avatarOption: {
    width: Dimensions.get('window').width * 0.35,
    height: Dimensions.get('window').width * 0.35,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    marginHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSelected: { borderColor: colors.primary, transform: [{ scale: 1.05 }] },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  nameInputContainer: { marginTop: spacing.xl, position: 'relative', paddingHorizontal: spacing.xl },
  nameInput: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: colors.input.border,
    paddingVertical: spacing.md,
    color: colors.text.primary,
    ...typography.body,
  },
  charCount: { position: 'absolute', right: spacing.xl, bottom: 10, fontSize: 12, color: colors.text.secondary },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xl },
  backButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
  },
  backButtonText: { color: colors.primary, fontWeight: '600' },
  nextButton: { width: '40%', borderRadius: 50, overflow: 'hidden' },
  nextButtonDisabled: { opacity: 0.7 },
  nextButtonGradient: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, justifyContent: 'center', alignItems: 'center' },
  nextButtonText: { color: colors.text.white, fontWeight: '600' },
});
