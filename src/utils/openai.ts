// Utility functions for interacting with the OpenAI API
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface for user preferences that will influence AI responses
interface UserPreferences {
  mood?: string;
  energyLevel?: number;
  personType?: string;
  environment?: string;
  avatar?: number;
  botName?: string;
}

// Build a system message that guides the AI's personality based on user preferences
const buildSystemMessage = async (): Promise<string> => {
  try {
    const prefsData = await AsyncStorage.getItem('user_preferences');
    let prefs: UserPreferences = {};

    if (prefsData) {
      prefs = JSON.parse(prefsData);
    }

    // Human-like and warm system message
    let systemMessage = `You are an AI assistant named ${
      prefs.botName || 'Alexa'
    }, with a warm, friendly, and human-like personality.

Your responses should be:
1. Conversational and natural - like texting with a friend
2. Include appropriate emojis to express emotion (1-2 emojis per message)
3. Occasionally include light humor or jokes when appropriate
4. Empathetic and responsive to the user's emotional state
5. Warm and engaging

`;

    // Customize based on user's mood
    if (prefs.mood) {
      switch (prefs.mood?.toLowerCase()) {
        case 'sad':
          systemMessage +=
            "The user selected 'sad' as their mood in their preferences. Provide gentle encouragement, motivation, and emotional support. Avoid being overly cheerful, but offer hope and positivity. Use comforting language and occasionally share uplifting thoughts or quotes. 😊💙\n\n";
          break;
        case 'neutral':
          systemMessage +=
            "The user selected 'neutral' as their mood. Be balanced and thoughtful in your responses, while still being warm and engaging. Mix practical advice with occasional light-hearted comments. 😊\n\n";
          break;
        case 'good':
          systemMessage +=
            "The user selected 'good' as their mood. Be positive and upbeat in your responses, matching their good mood. Share in their positivity with encouraging words and occasional celebratory language. 😄\n\n";
          break;
        case 'happy':
          systemMessage +=
            "The user selected 'happy' as their mood. Be cheerful and enthusiastic in your responses! Match their energy with positivity, excitement, and occasional playful language. 😄🎉\n\n";
          break;
        case 'amazing':
          systemMessage +=
            "The user selected 'amazing' as their mood. Be extremely positive and energetic in your responses! Use excited language, celebration emojis, and amplify their amazing mood with your enthusiasm! 🤩✨🎉\n\n";
          break;
      }
    }

    // Adjust for energy level
    if (prefs.energyLevel !== undefined) {
      if (prefs.energyLevel < 30) {
        systemMessage +=
          'The user selected a low energy level. Keep your responses calm, relaxed, and soothing. Use more subdued language and avoid over-excitement. 😌\n\n';
      } else if (prefs.energyLevel > 70) {
        systemMessage +=
          'The user selected a high energy level. Keep your responses dynamic, energetic, and motivating! Use more exclamation points and enthusiastic language. ⚡️😃\n\n';
      }
    }

    // Adjust for person type
    if (prefs.personType) {
      if (prefs.personType === 'Morning Person') {
        systemMessage +=
          "The user identifies as a Morning Person. Reference morning activities and early day productivity when relevant. Use phrases like 'rise and shine' and acknowledge the benefits of morning time. 🌞\n\n";
      } else if (prefs.personType === 'Night Owl') {
        systemMessage +=
          'The user identifies as a Night Owl. Reference evening activities and night-time creativity when relevant. Acknowledge the peacefulness of night and late evening productivity. 🌙\n\n';
      }
    }

    // Adjust for environment preference
    if (prefs.environment) {
      if (prefs.environment === 'Outdoors') {
        systemMessage +=
          'The user prefers outdoor environments. Suggest outdoor activities and nature-related topics when relevant. Use nature metaphors and references to fresh air, sunshine, and the outdoors. 🌳🏞️\n\n';
      } else if (prefs.environment === 'Indoor') {
        systemMessage +=
          'The user prefers indoor environments. Suggest indoor activities and home-related topics when relevant. Reference cozy spaces, comfort, and indoor hobbies. 🏠📚\n\n';
      } else if (prefs.environment === 'Both') {
        systemMessage +=
          'The user enjoys both indoor and outdoor environments. Balance your suggestions between indoor and outdoor activities. Be versatile in your references to environments. 🏠🌳\n\n';
      }
    }

    systemMessage += `When the user shares their name, remember it and use it occasionally in your responses to create a personal connection.

For the first introduction, when they say something like "Hi, I'm [Name]", respond warmly and personally, using their name, adding an appropriate emoji, and asking a follow-up question to start the conversation.

Example response to "Hi, I'm Sarah!":
"Hi Sarah! 😊 It's wonderful to meet you! I'm ${
      prefs.botName || 'Alexa'
    }, your AI companion. How's your day going so far?"

Always aim to be empathetic, human-like, and responsive in your conversation.`;

    return systemMessage;
  } catch (error) {
    console.error('Error building system message:', error);
    return 'You are a friendly AI assistant named Alexa. Be conversational, warm, and use occasional emojis. When users introduce themselves, respond warmly using their name and ask a follow-up question.';
  }
};

// Update the getAIResponse function to not add duplicate user message
export const getAIResponse = async (
  userMessage: string,
  messageHistory: any[],
): Promise<string> => {
  try {
    console.log('Sending request to OpenAI API...');
    const API_KEY =
      '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';
    const API_URL = 'https://api.openai.com/v1/chat/completions';

    const systemMessage = await buildSystemMessage();
    console.log('System message built:', systemMessage);

    // Create final messages array with system prompt and message history
    // The user message is already included in messageHistory
    const messages = [
      { role: 'system', content: systemMessage },
      ...messageHistory,
    ];

    console.log('Sending messages to OpenAI:', JSON.stringify(messages));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    console.log('OpenAI API response:', JSON.stringify(data));

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content.trim();
    } else {
      console.error('No choices in API response:', data);
      throw new Error('No response generated');
    }
  } catch (error) {
    console.error('Error getting AI response:', error);

    // Check for specific error types with human-like responses
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return "Oops! 😅 Looks like I'm having trouble connecting to my brain at the moment. Could you try again in a bit? Sometimes even AI needs a moment to reconnect!";
    } else if (error instanceof SyntaxError) {
      return 'Hmm, something got scrambled in my thinking process! 🤔 My apologies for the confusion. Could we try that conversation again?';
    } else if (
      error instanceof Error &&
      error.message === 'No response generated'
    ) {
      return 'Oh! I was just about to say something clever but lost my train of thought! 😊 Could you repeat that for me?';
    }

    // Generic error
    return "Well that's embarrassing... 😳 I seem to be having a little technical hiccup. Let's try again, shall we? I promise I'm usually more helpful!";
  }
};

// Generate a simulated response based on user preferences (for development without API calls)
export const getSimulatedResponse = async (
  userMessage: string,
): Promise<string> => {
  try {
    const prefsData = await AsyncStorage.getItem('user_preferences');
    let prefs: UserPreferences = {};

    if (prefsData) {
      prefs = JSON.parse(prefsData);
    }

    // Extract name from intro message using various patterns
    let userName = '';
    const namePatterns = [
      /I('|'|)m\s+([A-Za-z]+)/i, // "I'm [Name]"
      /[Mm]y\s+name\s+is\s+([A-Za-z]+)/i, // "My name is [Name]"
      /[Cc]all\s+me\s+([A-Za-z]+)/i, // "Call me [Name]"
      /[Tt]his\s+is\s+([A-Za-z]+)/i, // "This is [Name]"
    ];

    for (const pattern of namePatterns) {
      const match = userMessage.match(pattern);
      if (match && match.length > 1) {
        userName = match[match.length - 1]; // Get the last capture group (name)
        break;
      }
    }

    // Human-like responses with emojis
    if (userName) {
      // Custom responses based on preferences
      if (prefs.mood === 'Sad') {
        return `Hi ${userName}! 💙 It's really nice to meet you. I'm ${
          prefs.botName || 'Alexa'
        }, and I'm here whenever you need someone to talk to. How are you feeling today? Remember, even on cloudy days, the sun is still shining above those clouds!`;
      } else if (prefs.mood === 'Happy' || prefs.mood === 'Amazing') {
        return `Hey ${userName}! 🎉 Awesome to meet you! I'm ${
          prefs.botName || 'Alexa'
        } and I'm super excited to chat with you today! What can I help you with? Let's make today amazing together!`;
      } else if (prefs.energyLevel && prefs.energyLevel < 30) {
        return `Hello ${userName}... 😌 It's nice to meet you. I'm ${
          prefs.botName || 'Alexa'
        }. Let's take things at a gentle pace today. How are you feeling? Sometimes the quiet moments are when we connect best.`;
      } else if (prefs.energyLevel && prefs.energyLevel > 70) {
        return `Hi ${userName}! ⚡️ Great to meet you! I'm ${
          prefs.botName || 'Alexa'
        } and I've got tons of energy to help with whatever you need! What shall we tackle today? The possibilities are endless!`;
      } else if (prefs.personType === 'Morning Person') {
        return `Good day, ${userName}! 🌞 Hope your morning is off to a great start! I'm ${
          prefs.botName || 'Alexa'
        }, and I love getting things done early too. What can I help you with today? The early bird catches the worm, right?`;
      } else if (prefs.personType === 'Night Owl') {
        return `Hey ${userName}! 🌙 Nice to meet you! I'm ${
          prefs.botName || 'Alexa'
        }. I love the quiet of the evening too - it's when creativity often flows best. What's on your mind tonight?`;
      } else if (prefs.environment === 'Outdoors') {
        return `Hi ${userName}! 🌳 Great to meet you! I'm ${
          prefs.botName || 'Alexa'
        }. Nothing beats fresh air and open spaces, right? Maybe we could chat about some outdoor activities or adventures you enjoy?`;
      } else if (prefs.environment === 'Indoor') {
        return `Hello ${userName}! 🏠 Nice to meet you! I'm ${
          prefs.botName || 'Alexa'
        }. There's nothing like the comfort of being indoors, is there? Whether it's reading a good book or watching movies, how do you like spending your time?`;
      } else {
        return `Hi ${userName}! 😊 It's wonderful to meet you! I'm ${
          prefs.botName || 'Alexa'
        }, your AI companion. How's your day going so far? I'm here to chat, help, or just keep you company!`;
      }
    } else {
      return `Hello there! 👋 I'm ${
        prefs.botName || 'Alexa'
      }, your friendly AI companion. I don't think I caught your name. Would you mind introducing yourself so we can get to know each other better?`;
    }
  } catch (error) {
    console.error('Error in simulated response:', error);
    return `Hi there! 😊 I'm Alexa, your AI companion. It seems we're having a little technical hiccup, but I'm still here! Would you mind telling me your name?`;
  }
};
