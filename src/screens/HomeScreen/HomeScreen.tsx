import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Keyboard,
  Alert,
  BackHandler, 
  TouchableWithoutFeedback,
  AppState,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomDrawer } from '../../components';

// Import the OpenAI utility
import { getAIResponse } from '../../utils';
import MyBannerAd from '../../components/MyBannerAd';
import { rewardedAdManager } from '../../services/OpenAppAdManager';

interface HomeScreenProps {
  navigation: any;
}
``
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface UserPreferences {
  mood: string;
  energyLevel: number;
  personType: string;
  environment: string;
  avatar: number;
  botName: string;
}

interface UserCoins {
  coins: number;
  messagesUsed: number;
  totalMessages: number;
}

// Static image imports
const avatarImages = [
  require('../../../assets/images/1.jpg'),
  require('../../../assets/images/2.jpg'),
  require('../../../assets/images/3.jpg'),
  require('../../../assets/images/4.jpg'),
];

// Update background images to use available image assets and handle potential missing files
const backgroundImages: Record<string, any> = {
  // Avatar-based backgrounds
  avatar0: require('../../../assets/images/1.jpg'),
  avatar1: require('../../../assets/images/2.jpg'),
  avatar2: require('../../../assets/images/3.jpg'),
  avatar3: require('../../../assets/images/4.jpg'),
};

// Update the background selection logic
const getBackgroundImage = (preferences: UserPreferences) => {
  // First try to get environment-based background
  if (preferences.environment && backgroundImages[preferences.environment]) {
    try {
      // Test if the environment image can be loaded
      return backgroundImages[preferences.environment];
    } catch (error) {
      console.log(
        'Environment background not found, falling back to avatar background',
      );
      // Fallback to avatar-based background
    }
  }

  // If environment background is not available or not set, use avatar-based background
  if (preferences.avatar !== undefined && preferences.avatar >= 0) {
    const avatarKey = `avatar${preferences.avatar}`;
    if (backgroundImages[avatarKey]) {
      return backgroundImages[avatarKey];
    }
  }

  // Default background if nothing else is available
  return backgroundImages.avatar0;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [message, setMessage] = useState('');
  const [botName, setBotName] = useState<string>('Alexa');
  const [messages, setMessages] = useState<Message[]>([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<any>(null);

  // Add state for menu visibility
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Add coin system state
  const [userCoins, setUserCoins] = useState<UserCoins>({
    coins: 5,
    messagesUsed: 0,
    totalMessages: 10,
  });
  const [showAdModal, setShowAdModal] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Handle back button to prevent navigation to login screen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Prevent going back to login screen
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit the app?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', onPress: () => BackHandler.exitApp() }
          ],
          { cancelable: true }
        );
        return true; // Prevent default back action
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  // Get avatar image based on index
  const getAvatarImage = (index: number) => {
    if (index >= 0 && index < avatarImages.length) {
      return avatarImages[index];
    }
    return avatarImages[0]; // Default to first avatar
  };

  // Load user preferences and coins
  const loadPreferences = async () => {
    try {
      const preferencesData = await AsyncStorage.getItem('user_preferences');
      if (preferencesData) {
        const preferences = JSON.parse(preferencesData);
        console.log('Loaded preferences:', preferences);

        // Update state with preferences
        setUserPreferences(preferences);

        // Set bot name if available
        const name = preferences.botName || 'Alexa';
        setBotName(name);

        // Check if we need to update the welcome message with the new bot name
        const savedMessages = await AsyncStorage.getItem('chat_messages');
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);

          // If there's only one message and it's the welcome message, update it with the new bot name
          if (parsedMessages.length === 1 && parsedMessages[0].id === '1') {
            const updatedWelcomeMessage = {
              ...parsedMessages[0],
              text: `Hi there! 👋 I'm ${name} your personal AI companion. I'd love to get to know you better! What's your name?`,
            };

            // Save and set updated message
            await AsyncStorage.setItem(
              'chat_messages',
              JSON.stringify([updatedWelcomeMessage]),
            );
            setMessages([
              {
                ...updatedWelcomeMessage,
                timestamp: new Date(updatedWelcomeMessage.timestamp),
              },
            ]);
          }
        }
      }

      // Load coins data
      await loadCoinsData();
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  // Load coins data from AsyncStorage
  const loadCoinsData = async () => {
    try {
      const coinsData = await AsyncStorage.getItem('user_coins');
      if (coinsData) {
        const coins = JSON.parse(coinsData);
        setUserCoins(coins);
      } else {
        // First time user, set initial coins
        const initialCoins = {
          coins: 5,
          messagesUsed: 0,
          totalMessages: 10,
        };
        await AsyncStorage.setItem('user_coins', JSON.stringify(initialCoins));
        setUserCoins(initialCoins);
      }
    } catch (error) {
      console.error('Error loading coins data:', error);
    }
  };

  // Save coins data to AsyncStorage
  const saveCoinsData = async (coinsData: UserCoins) => {
    try {
      await AsyncStorage.setItem('user_coins', JSON.stringify(coinsData));
    } catch (error) {
      console.error('Error saving coins data:', error);
    }
  };

  // Function to handle watching ad and earning coins
  const watchAdForCoins = async () => {
    setShowAdModal(false);

    const success = await rewardedAdManager.showAd(() => {
      // This callback runs when user earns reward
      const updatedCoins = {
        ...userCoins,
        coins: userCoins.coins + 2,
        totalMessages: userCoins.totalMessages + 4,
      };

      setUserCoins(updatedCoins);
      saveCoinsData(updatedCoins);

      Alert.alert(
        'Coins Earned! 🎉',
        'You earned 2 coins! You can now send 4 more messages.',
        [{ text: 'Great!', style: 'default' }]
      );
    });

    if (!success) {
      Alert.alert(
        'Ad Not Ready',
        'The rewarded ad is not ready yet. Please try again later.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  // Check if user can send message
  const canSendMessage = () => {
    return userCoins.messagesUsed < userCoins.totalMessages;
  };

  // Use coins when sending message
  const useCoins = () => {
    const updatedCoins = {
      ...userCoins,
      messagesUsed: userCoins.messagesUsed + 1,
    };

    // Update coins count (1 coin = 2 messages, so subtract 0.5 coin per message)
    if (updatedCoins.messagesUsed % 2 === 0) {
      updatedCoins.coins = updatedCoins.coins - 1;
    }

    setUserCoins(updatedCoins);
    saveCoinsData(updatedCoins);
  };

  // Load user preferences
  useEffect(() => {
    loadPreferences();
  }, []);

  // Add useFocusEffect to reload preferences when screen gets focus
  useFocusEffect(
    React.useCallback(() => {
      // Reload preferences when screen gets focus
      loadPreferences();
      return () => {};
    }, []),
  );

  // Add AppState listener to reload preferences when app comes back to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // App has come to the foreground
        loadPreferences();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Update the background selection logic
  useEffect(() => {
    if (userPreferences) {
      setBackgroundImage(getBackgroundImage(userPreferences));
    }
  }, [userPreferences]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Save messages to AsyncStorage whenever they change
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem('chat_messages', JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving chat messages:', error);
      }
    };

    // Only save if there are messages to save
    if (messages.length > 0) {
      saveMessages();
    }
  }, [messages]);

  // Load preferences and saved messages once
  useEffect(() => {
    const initialLoad = async () => {
      await loadPreferences();
      await loadSavedMessages();
    };
    initialLoad();
  }, []);

  // Load saved chat messages with proper bot name check
  const loadSavedMessages = async () => {
    try {
      // Get current bot name from preferences
      const preferencesData = await AsyncStorage.getItem('user_preferences');
      const currentBotName = preferencesData
        ? JSON.parse(preferencesData).botName || 'Alexa'
        : 'Alexa';

      const savedMessages = await AsyncStorage.getItem('chat_messages');

      if (savedMessages) {
        // Parse saved messages and convert string timestamps back to Date objects
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));

        // Check if welcome message has correct bot name
        if (parsedMessages.length > 0 && parsedMessages[0].id === '1') {
          const welcomeMsg = parsedMessages[0];
          // If welcome message doesn't contain current bot name, update it
          if (!welcomeMsg.text.includes(`I'm ${currentBotName}`)) {
            parsedMessages[0] = {
              ...welcomeMsg,
              text: `Hi there! 👋 I'm ${currentBotName} your personal AI companion. I'd love to get to know you better! What's your name?`,
            };

            // Save updated messages
            await AsyncStorage.setItem(
              'chat_messages',
              JSON.stringify(parsedMessages),
            );
          }
        }

        setMessages(parsedMessages);
      } else {
        // If no saved messages, set the initial greeting
        const name = currentBotName;
        setMessages([
          {
            id: '1',
            text: `Hi there! 👋 I'm ${name} your personal AI companion. I'd love to get to know you better! What's your name?`,
            sender: 'ai',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading saved messages:', error);
    }
  };

  // Clear chat history
  const clearChatHistory = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all chat messages? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove chat messages from AsyncStorage
              await AsyncStorage.removeItem('chat_messages');

              // Set initial message
              const name = userPreferences?.botName || 'Alexa';
              setMessages([
                {
                  id: '1',
                  text: `Hi there! 👋 I'm ${name} your personal AI companion. I'd love to get to know you better! What's your name?`,
                  sender: 'ai',
                  timestamp: new Date(),
                },
              ]);
            } catch (error) {
              console.error('Error clearing chat history:', error);
            }
          },
        },
      ],
    );
  };

  // Replace the sendMessage function with coin system
  const sendMessage = async () => {
    if (message.trim() === '') return;

    // Check if user has enough messages left
    if (!canSendMessage()) {
      setShowAdModal(true);
      return;
    }

    // Use coins
    useCoins();

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    // Add user message to chat
    const messagesWithUser = [...messages, userMessage];
    setMessages(messagesWithUser);
    setMessage('');

    // Create typing indicator
    const typingIndicatorId = 'typing-' + Date.now();
    const typingIndicator: Message = {
      id: typingIndicatorId,
      text: '...',
      sender: 'ai',
      timestamp: new Date(),
    };

    // Add typing indicator
    setMessages([...messagesWithUser, typingIndicator]);

    try {
      // Convert messages to format expected by OpenAI
      const messageHistory = messagesWithUser.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      console.log(
        'Message history for OpenAI:',
        JSON.stringify(messageHistory),
      );
      console.log('Current message:', userMessage.text);

      // Get AI response from OpenAI API
      const aiResponseText = await getAIResponse(
        userMessage.text,
        messageHistory,
      );

      // Create AI response message
      const aiResponseMessage: Message = {
        id: Date.now().toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };

      // Replace typing indicator with actual response
      setMessages(current =>
        current
          .filter(msg => msg.id !== typingIndicatorId)
          .concat(aiResponseMessage),
      );
    } catch (error) {
      console.error('Error getting AI response:', error);

      // Create error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
      };

      // Replace typing indicator with error message
      setMessages(current =>
        current
          .filter(msg => msg.id !== typingIndicatorId)
          .concat(errorMessage),
      );
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  // Add this useEffect to dismiss menu when tapping outside
  useEffect(() => {
    const handleOutsidePress = () => {
      if (isMenuVisible) {
        setIsMenuVisible(false);
      }
    };

    // Add event listener for tap outside
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isMenuVisible) {
          setIsMenuVisible(false);
          return true;
        }
        return false;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, [isMenuVisible]);

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user'
          ? styles.userMessageContainer
          : styles.aiMessageContainer,
      ]}
    >
      {item.sender === 'ai' && (
        <View style={styles.avatarContainer}>
          <Image
            source={
              userPreferences &&
              userPreferences.avatar !== undefined &&
              userPreferences.avatar >= 0
                ? getAvatarImage(userPreferences.avatar)
                : avatarImages[0]
            }
            style={styles.avatarSmall}
          />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.sender === 'user'
              ? styles.userMessageText
              : styles.aiMessageText,
          ]}
        >
          {item.text}
        </Text>
      </View>
      <Text
        style={[
          styles.timestamp,
          item.sender === 'user' ? styles.userTimestamp : styles.aiTimestamp,
        ]}
      >
        {formatTime(item.timestamp)}
      </Text>
    </View>
  );

  // Update the header to show coins
  const renderHeader = () => (
    <LinearGradient
      colors={['#00BFFF', '#FF69B4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.header}
    >
      <TouchableOpacity style={styles.headerContent} onPress={toggleDrawer}>
        <Image
          source={
            userPreferences &&
            userPreferences.avatar !== undefined &&
            userPreferences.avatar >= 0
              ? getAvatarImage(userPreferences.avatar)
              : avatarImages[0]
          }
          style={styles.avatar}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerName}>{botName}</Text>
          <Text style={styles.headerStatus}>Active now</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.headerRightContainer}>
        {/* Coins Display */}
        <View style={styles.coinsContainer}>
          <Icon name="monetization-on" size={18} color="#FFD700" />
          <Text style={styles.coinsText}>{userCoins.coins}</Text>
          <Text style={styles.messagesLeftText}>
            {userCoins.totalMessages - userCoins.messagesUsed} left
          </Text>
        </View>

        <TouchableOpacity style={styles.optionsButton} onPress={toggleMenu}>
          <Icon name="more-vert" size={24} color="#fff" />
        </TouchableOpacity>

        {isMenuVisible && (
          <View style={styles.menuDropdown}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuVisible(false);
                clearChatHistory();
              }}
            >
              <Icon
                name="delete"
                size={20}
                color="#555"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Clear Chat</Text>
            </TouchableOpacity>

          </View>
        )}
      </View>
    </LinearGradient>
  );

  const mainContent = (
    <SafeAreaView style={styles.container}>
      <View style={styles.bannerContainer}>
        <MyBannerAd />
      </View>

      {renderHeader()}

      {isMenuVisible && (
        <TouchableWithoutFeedback onPress={() => setIsMenuVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <View style={styles.contentContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.inputWrapper}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={
                canSendMessage() 
                  ? "Type your message..."
                  : "Press On Mic Icon To earb coins ->"
              }
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              editable={canSendMessage()}
            />
            {message.trim() === '' ? (
              <TouchableOpacity 
                style={styles.micButton}
                onPress={canSendMessage() ? undefined : () => setShowAdModal(true)}
              >
                <LinearGradient
                  colors={canSendMessage() ? ['#FF66CC', '#6666FF'] : ['#ccc', '#999']}
                  style={styles.micButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Icon name="mic" size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.sendButton} 
                onPress={sendMessage}
                disabled={!canSendMessage()}
              >
                <LinearGradient
                  colors={canSendMessage() ? ['#FF66CC', '#6666FF'] : ['#ccc', '#999']}
                  style={styles.sendButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Icon name="send" size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>

      {/* Ad Modal */}
      {showAdModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.adModal}>
            <Text style={styles.adModalTitle}>🪙 No More Messages!</Text>
            <Text style={styles.adModalText}>
              You've used all your messages. Watch an ad to earn 2 more coins and continue chatting!
            </Text>
            <View style={styles.adModalButtons}>
              <TouchableOpacity 
                style={styles.watchAdButton}
                onPress={watchAdForCoins}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.watchAdButtonGradient}
                >
                  <Icon name="play-arrow" size={20} color="#fff" />
                  <Text style={styles.watchAdButtonText}>Watch Ad (+2 🪙)</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelAdButton}
                onPress={() => setShowAdModal(false)}
              >
                <Text style={styles.cancelAdButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );

  return (
    <>
      {backgroundImage ? (
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
        >
          {mainContent}
        </ImageBackground>
      ) : (
        mainContent
      )}

      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        navigation={navigation}
        userName="Alex Johnson"
        userEmail="alex@example.com"
        profileImage={
          userPreferences &&
          userPreferences.avatar !== undefined &&
          userPreferences.avatar >= 0
            ? getAvatarImage(userPreferences.avatar)
            : avatarImages[0]
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // New style for banner container at the top
  bannerContainer: {
    backgroundColor:   '#a37d7dff', // You can change this or make it transparent

    borderBottomColor: '#a37d7dff',
    zIndex: 100,
  },
  header: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 10,
  },
  coinsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
  messagesLeftText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
    opacity: 0.9,
  },
  optionsButton: {
    padding: spacing.xs,
    width: 40,
    height: 40,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  headerTextContainer: {
    marginLeft: spacing.md,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerStatus: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  messagesList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  messageContainer: {
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 18,
    padding: spacing.md,
  },
  userBubble: {
    backgroundColor: '#FF66CC',
    borderTopRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    color: '#888',
  },
  userTimestamp: {
    alignSelf: 'flex-end',
  },
  aiTimestamp: {
    marginLeft: 38,
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  attachButton: {
    padding: spacing.xs,
  },
  imageButton: {
    padding: spacing.xs,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    maxHeight: 100,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Add styles for the dropdown menu
  menuDropdown: {
    position: 'absolute',
    top: 45,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10, // Higher than overlay
    width: 150,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.01)', // Almost transparent but still captures touches
    zIndex: 5,
  },
  // Ad Modal Styles
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  adModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  adModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  adModalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  adModalButtons: {
    width: '100%',
  },
  watchAdButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  watchAdButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  watchAdButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cancelAdButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelAdButtonText: {
    color: '#999',
    fontSize: 16,
  },
});

// Export as default
export default HomeScreen;

