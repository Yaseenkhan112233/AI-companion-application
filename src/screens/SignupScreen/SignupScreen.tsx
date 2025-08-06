
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
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
import auth from '@react-native-firebase/auth';
import { GradientBackground } from '../../components/GradientBackground';
import { colors } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GoogleAuthProvider } from '@react-native-firebase/auth';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentGoogleUser, setCurrentGoogleUser] = useState<User | null>(null);



  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      return Alert.alert('Error', 'All fields are required.');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match.');
    }

    try {
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Account created!', [
        { text: 'OK', onPress: () => navigation.navigate('SignIn') },
      ]);
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Something went wrong');
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.innerContainer}>
          <Text style={styles.heading}>Create Account</Text>

         

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or create with email</Text>
            <View style={styles.divider} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.7)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.7)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="rgba(255,255,255,0.7)"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.switchText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  googleSection: {
    marginBottom: 20,
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
  currentAccountInfo: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  currentAccountText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 6,
  },
  changeAccountButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  changeAccountText: {
    color: '#fff',
    fontSize: 12,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    color: '#fff',
    marginHorizontal: 16,
    fontSize: 14,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  button: {
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
  switchText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 24,
    textDecorationLine: 'underline',
  },
});

