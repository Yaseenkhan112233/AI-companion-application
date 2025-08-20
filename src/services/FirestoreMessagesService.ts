// services/FirestoreMessagesService.ts
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export class FirestoreMessagesService {
  
  // Get current user ID
  private getCurrentUserId(): string | null {
    const user = auth().currentUser;
    return user ? user.uid : null;
  }

  // Save a single message to Firestore
  async saveMessage(message: Message): Promise<boolean> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        console.error('No authenticated user found');
        return false;
      }

      // Reference to the user's messages subcollection
      const messagesRef = firestore()
        .collection('users')
        .doc(userId)
        .collection('messages');

      // Save message with custom ID or auto-generated
      await messagesRef.doc(message.id).set({
        text: message.text,
        sender: message.sender,
        timestamp: firestore.Timestamp.fromDate(message.timestamp),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      console.log('✅ Message saved to Firestore:', message.id);
      return true;
    } catch (error) {
      console.error('❌ Error saving message to Firestore:', error);
      return false;
    }
  }

  // Save multiple messages in batch
  async saveMessagesBatch(messages: Message[]): Promise<boolean> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        console.error('No authenticated user found');
        return false;
      }

      const batch = firestore().batch();
      const messagesRef = firestore()
        .collection('users')
        .doc(userId)
        .collection('messages');

      messages.forEach(message => {
        const docRef = messagesRef.doc(message.id);
        batch.set(docRef, {
          text: message.text,
          sender: message.sender,
          timestamp: firestore.Timestamp.fromDate(message.timestamp),
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();
      console.log(`✅ ${messages.length} messages saved to Firestore in batch`);
      return true;
    } catch (error) {
      console.error('❌ Error saving messages batch to Firestore:', error);
      return false;
    }
  }

  // Load all messages for current user
  async loadMessages(): Promise<Message[]> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        console.error('No authenticated user found');
        return [];
      }

      const messagesSnapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .get();

      const messages: Message[] = messagesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          sender: data.sender,
          timestamp: data.timestamp.toDate(),
        };
      });

      console.log(`✅ Loaded ${messages.length} messages from Firestore`);
      return messages;
    } catch (error) {
      console.error('❌ Error loading messages from Firestore:', error);
      return [];
    }
  }

  // Real-time listener for messages
  subscribeToMessages(callback: (messages: Message[]) => void): () => void {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.error('No authenticated user found');
      return () => {};
    }

    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        snapshot => {
          const messages: Message[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              text: data.text,
              sender: data.sender,
              timestamp: data.timestamp.toDate(),
            };
          });
          callback(messages);
        },
        error => {
          console.error('❌ Error in messages subscription:', error);
        }
      );

    return unsubscribe;
  }

  // Clear all messages for current user
  async clearAllMessages(): Promise<boolean> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        console.error('No authenticated user found');
        return false;
      }

      const messagesSnapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('messages')
        .get();

      const batch = firestore().batch();
      messagesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log('✅ All messages cleared from Firestore');
      return true;
    } catch (error) {
      console.error('❌ Error clearing messages from Firestore:', error);
      return false;
    }
  }

  // Delete a specific message
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        console.error('No authenticated user found');
        return false;
      }

      await firestore()
        .collection('users')
        .doc(userId)
        .collection('messages')
        .doc(messageId)
        .delete();

      console.log('✅ Message deleted from Firestore:', messageId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting message from Firestore:', error);
      return false;
    }
  }

  // Sync local messages with Firestore (useful for migration)
  async syncLocalMessages(localMessages: Message[]): Promise<boolean> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        console.error('No authenticated user found');
        return false;
      }

      // First, get existing messages from Firestore
      const existingMessages = await this.loadMessages();
      const existingIds = existingMessages.map(msg => msg.id);

      // Filter out messages that already exist
      const newMessages = localMessages.filter(msg => !existingIds.includes(msg.id));

      if (newMessages.length > 0) {
        await this.saveMessagesBatch(newMessages);
        console.log(`✅ Synced ${newMessages.length} new messages to Firestore`);
      } else {
        console.log('✅ All messages already synced');
      }

      return true;
    } catch (error) {
      console.error('❌ Error syncing messages:', error);
      return false;
    }
  }
}

// Export singleton instance
export const firestoreMessagesService = new FirestoreMessagesService();