// hooks/useGoogleSignIn.ts
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin, statusCodes, User } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { useEffect } from 'react';

export const useGoogleSignIn = () => {
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '191123860425-al596g6e2jj73v4um1tb43cjpmrmma0q.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: User = await GoogleSignin.signIn();
      console.log('Google user info:', userInfo);
      navigation.navigate('Questionnaire' as never);
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

  return { signInWithGoogle };
};
