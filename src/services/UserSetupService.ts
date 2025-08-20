// services/UserSetupService.ts
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export class UserSetupService {
  
  // Create initial user document with metadata
  static async createUserDocument(userData?: {
    email?: string;
    displayName?: string;
    photoURL?: string;
  }): Promise<boolean> {
    try {
      const user = auth().currentUser;
      if (!user) {
        console.error('No authenticated user found');
        return false;
      }

      const userRef = firestore().collection('users').doc(user.uid);
      
      // Check if user document already exists
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        console.log('User document already exists');
        return true;
      }

      // Create user document with initial data
      await userRef.set({
        uid: user.uid,
        email: userData?.email || user.email,
        displayName: userData?.displayName || user.displayName,
        photoURL: userData?.photoURL || user.photoURL,
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastLoginAt: firestore.FieldValue.serverTimestamp(),
        preferences: {
          botName: 'Alexa',
          avatar: 0,
          // Add other default preferences
        },
        coins: {
          coins: 5,
          messagesUsed: 0,
          totalMessages: 10,
        },
        stats: {
          totalMessages: 0,
          totalConversations: 0,
        }
      });

      console.log('✅ User document created successfully');
      return true;
    } catch (error) {
      console.error('❌ Error creating user document:', error);
      return false;
    }
  }

  // Update user's last login timestamp
  static async updateLastLogin(): Promise<boolean> {
    try {
      const user = auth().currentUser;
      if (!user) return false;

      await firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          lastLoginAt: firestore.FieldValue.serverTimestamp(),
        });

      return true;
    } catch (error) {
      console.error('Error updating last login:', error);
      return false;
    }
  }

  // Save user preferences to Firestore
  static async saveUserPreferences(preferences: any): Promise<boolean> {
    try {
      const user = auth().currentUser;
      if (!user) return false;

      await firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          preferences: preferences,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log('✅ User preferences saved to Firestore');
      return true;
    } catch (error) {
      console.error('❌ Error saving user preferences:', error);
      return false;
    }
  }

  // Save user coins data to Firestore
  static async saveUserCoins(coinsData: any): Promise<boolean> {
    try {
      const user = auth().currentUser;
      if (!user) return false;

      await firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          coins: coinsData,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      return true;
    } catch (error) {
      console.error('❌ Error saving user coins:', error);
      return false;
    }
  }

  // Load user preferences from Firestore
  static async loadUserPreferences(): Promise<any> {
    try {
      const user = auth().currentUser;
      if (!user) return null;

      const userDoc = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        return userData?.preferences || null;
      }

      return null;
    } catch (error) {
      console.error('❌ Error loading user preferences:', error);
      return null;
    }
  }

  // Load user coins from Firestore
  static async loadUserCoins(): Promise<any> {
    try {
      const user = auth().currentUser;
      if (!user) return null;

      const userDoc = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        return userData?.coins || null;
      }

      return null;
    } catch (error) {
      console.error('❌ Error loading user coins:', error);
      return null;
    }
  }
}

// Usage example in your SignIn component:
/*
// After successful authentication:
await UserSetupService.createUserDocument({
  email: result.user.email,
  displayName: result.user.displayName,
  photoURL: result.user.photoURL,
});

await UserSetupService.updateLastLogin();
*/