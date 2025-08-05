// import React from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   Dimensions,
//   Animated,
//   Pressable,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { colors, spacing, typography } from '../../theme';

// interface DrawerProps {
//   isOpen: boolean;
//   onClose: () => void;
//   navigation: any;
//   userName: string;
//   userEmail: string;
//   profileImage: any;
// }

// const { width } = Dimensions.get('window');
// const DRAWER_WIDTH = width * 0.65;

// export const CustomDrawer = ({
//   isOpen,
//   onClose,
//   navigation,
//   userName = 'Alex Johnson',
//   userEmail = 'alex@example.com',
//   profileImage,
// }: DrawerProps) => {
//   const translateX = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;

//   React.useEffect(() => {
//     Animated.timing(translateX, {
//       toValue: isOpen ? 0 : -DRAWER_WIDTH,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   }, [isOpen, translateX]);

//   const handleNavigation = (screen: string) => {
//     onClose();
//     // Add a small delay to make the navigation smoother
//     setTimeout(() => {
//       navigation.navigate(screen);
//     }, 300);
//   };

//   const handleLogout = () => {
//     onClose();
//     // Add logout logic here
//     console.log('Logging out');
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <Pressable style={styles.backdrop} onPress={onClose} />
//       <Animated.View
//         style={[styles.container, { transform: [{ translateX }] }]}
//       >
//         {/* Header with profile info */}
//         <View style={styles.header}>
//           <Image
//             source={profileImage || require('../../../assets/images/1.jpg')}
//             style={styles.profileImage}
//           />
//           <Text style={styles.userName}>{userName}</Text>
//           <Text style={styles.userEmail}>{userEmail}</Text>
//         </View>

//         {/* Menu Items */}
//         <View style={styles.menuContainer}>
//           <TouchableOpacity
//             style={styles.menuItem}
//             onPress={() => handleNavigation('Home')}
//           >
//             <Icon name="chat" size={24} color="#333" style={styles.menuIcon} />
//             <Text style={styles.menuText}>Chat</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.menuItem}
//             onPress={() => handleNavigation('ProfileSettings')}
//           >
//             <Icon
//               name="person"
//               size={24}
//               color="#333"
//               style={styles.menuIcon}
//             />
//             <Text style={styles.menuText}>Profile Setting</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.menuItem}
//             onPress={() => handleNavigation('HelpFeedback')}
//           >
//             <Icon name="help" size={24} color="#333" style={styles.menuIcon} />
//             <Text style={styles.menuText}>Help & Feedback</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Logout Button */}
//         <View style={styles.logoutContainer}>
//           <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//             <Icon
//               name="logout"
//               size={24}
//               color="#ff4757"
//               style={styles.menuIcon}
//             />
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   backdrop: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     zIndex: 1,
//   },
//   container: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     width: DRAWER_WIDTH,
//     backgroundColor: 'white',
//     zIndex: 2,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 2,
//       height: 0,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   header: {
//     padding: spacing.xl,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: spacing.md,
//   },
//   userName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: spacing.xs,
//   },
//   userEmail: {
//     fontSize: 14,
//     color: '#666',
//   },
//   menuContainer: {
//     padding: spacing.md,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f8f8f8',
//   },
//   menuIcon: {
//     marginRight: spacing.md,
//   },
//   menuText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   logoutContainer: {
//     padding: spacing.md,
//     marginTop: 'auto', // Push to bottom
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: spacing.md,
//   },
//   logoutText: {
//     fontSize: 16,
//     color: '#ff4757',
//     fontWeight: '500',
//   },
// });

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Pressable,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { colors, spacing, typography } from '../../theme';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: any;
  userName: string;
  userEmail: string;
  profileImage: any;
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.65;

export const CustomDrawer = ({
  isOpen,
  onClose,
  navigation,
  userName = 'Alex Johnson',
  userEmail = 'alex@example.com',
  profileImage,
}: DrawerProps) => {
  const translateX = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, translateX]);

  const handleNavigation = (screen: string) => {
    onClose();
    // Add a small delay to make the navigation smoother
    setTimeout(() => {
      navigation.navigate(screen);
    }, 300);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: performLogout,
        },
      ],
      { cancelable: true },
    );
  };

  const performLogout = async () => {
    try {
      // Close the drawer first
      onClose();

      // Check if user is signed in with Google and sign out
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
        console.log('Google sign out successful');
      }

      // Clear all stored user data
      await AsyncStorage.multiRemove([
        'userToken',
        'refreshToken',
        'userData',
        'isLoggedIn',
        'userSession',
        'googleUserInfo',
        'user_data',
        // Add any other keys you use for user data
      ]);

      // Reset navigation stack and navigate back to SignIn screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }], // Navigate back to your SignInScreen
      });

      // Optional: Show success message
      setTimeout(() => {
        Alert.alert('Success', 'You have been logged out successfully.');
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);

      // Even if Google sign out fails, still clear local data and navigate
      try {
        await AsyncStorage.multiRemove([
          'userToken',
          'refreshToken',
          'userData',
          'isLoggedIn',
          'userSession',
          'googleUserInfo',
          'user_data',
        ]);

        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });

        Alert.alert(
          'Logged Out',
          'You have been logged out (with some cleanup issues).',
        );
      } catch (clearError) {
        console.error('Failed to clear data:', clearError);
        Alert.alert('Error', 'Failed to logout completely. Please try again.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[styles.container, { transform: [{ translateX }] }]}
      >
        {/* Header with profile info */}
        <View style={styles.header}>
          <Image
            source={profileImage || require('../../../assets/images/1.jpg')}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('Home')}
          >
            <Icon name="chat" size={24} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('ProfileSettings')}
          >
            <Icon
              name="person"
              size={24}
              color="#333"
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Profile Setting</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('HelpFeedback')}
          >
            <Icon name="help" size={24} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuText}>Help & Feedback</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon
              name="logout"
              size={24}
              color="#ff4757"
              style={styles.menuIcon}
            />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: 'white',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.md,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    padding: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  menuIcon: {
    marginRight: spacing.md,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  logoutContainer: {
    padding: spacing.md,
    marginTop: 'auto', // Push to bottom
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  logoutText: {
    fontSize: 16,
    color: '#ff4757',
    fontWeight: '500',
  },
});
