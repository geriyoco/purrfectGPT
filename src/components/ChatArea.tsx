import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { getBotResponse } from '../services/openai';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TypingText from './TypingText';


type Message = { text: string, isBot: boolean };
type MessageProps = { message: Message };

function ChatArea() {
  const [messageHistory, setMessageHistory] = useState<Array<Message>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [travelEndButton, setTravelEndButton] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    setMessageHistory([...messageHistory, { text: currentMessage, isBot: false }]);

    const botResponsePromise = getBotResponse(currentMessage, messageHistory);
    botResponsePromise.then((botResponse) => {
      setMessageHistory((prevMessages) => [...prevMessages, { text: botResponse.text, isBot: true }])
    });

    setCurrentMessage('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Enter' && currentMessage && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (offsetY < contentHeight - layoutHeight) {
      setTravelEndButton(true);
    } else {
      setTravelEndButton(false);
    }
  };


  return (
    <View style={styles.chatArea}>
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messageHistory}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <MessageItem message={item} />}
          contentContainerStyle={styles.messagesList}
          inverted={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={<View style={styles.listFooter}></View>}
          onScroll={handleScroll}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.endButtonContainer}>
          {travelEndButton &&
            <TouchableOpacity style={styles.endButton} onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}>
              <FeatherIcon name="arrow-down-circle" size={20} color="#fff" />
            </TouchableOpacity>
          }
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            textAlignVertical="bottom"
            multiline={true}
            style={styles.input}
            placeholder="Send a message..."
            value={currentMessage}
            onChangeText={setCurrentMessage}
            onKeyPress={handleKeyDown}
          />
          <TouchableOpacity disabled={!currentMessage} style={styles.button} onPress={handleSend}>
            <FeatherIcon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const MessageItem = (props: MessageProps) => {
  return (
    <View style={[styles.messageItem, props.message.isBot ? styles.botMessage : styles.userMessage]}>
      {props.message.isBot ?
        <MaterialCommunityIcons style={styles.icon} name="robot-outline" size={20} color="#fff" /> :
        <FeatherIcon style={styles.icon} name="user" size={20} color="#fff" />
      }
      <Text style={styles.textMessage}>{props.message.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chatArea: {
    color: '#fff',
    flex: 1,
    width: '100%',
    backgroundColor: 'rgb(52,53,65)',
  },
  messagesContainer: {
    flex: 1,
    color: 'white'
  },
  messagesList: {
    paddingVertical: 0,
  },
  botMessage: {
    backgroundColor: 'rgb(68,70,84)',
  },
  userMessage: {
    backgroundColor: 'rgb(52,53,65)',
  },
  textMessage: {
    flexShrink: 1,
    color: 'white'
  },
  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(180deg,rgba(68,70,84,0.1),rgba(52,53,65) 58.85%)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
    padding: 20
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'rgb(64,65,79)',
    color: '#FFF',
    width: '70%',
    height: 60,
    borderWidth: 1,
    padding: 10,
    borderColor: 'rgba(32,33,35,.5)',
    borderRadius: 10,
  },
  button: {
    backgroundColor: 'rgb(64,65,79)',
    borderRadius: 10,
    padding: 15,
  },
  icon: {
    paddingRight: 15,
  },
  listFooter: {
    padding: 20,
    height: 200
  },
  endButton: {
  },
  endButtonContainer: {
    backgroundColor: 'transparent',
    textAlign: 'right',
    marginRight: 20,
    marginBottom: 20,
  },
  messageItem: {
    flex: 1,
    flexShrink: 1,
    flexDirection: 'row',
    color: 'white',
    padding: 20
  }
});

export default ChatArea;
