import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { getBotResponse } from '../../services/openai';

type Message = {text: string, isBot: boolean};
type MessageProps = {message: Message};

function ChatArea() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    setMessages([...messages, { text: currentMessage, isBot: false }]);

    const botResponsePromise = getBotResponse(currentMessage);
    botResponsePromise.then((botResponse) => {
      setMessages((prevMessages) => [...prevMessages, { text: botResponse.text, isBot: true }])
    });

    setCurrentMessage('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <View style={styles.chatArea}>
      <View style={styles.messagesContainer}>
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <MessageItem message={item} />}
          contentContainerStyle={styles.messagesList}
          inverted={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Send a message..."
          value={currentMessage}
          onChangeText={setCurrentMessage}
          onKeyPress={handleKeyDown}
          ref={inputRef}
        />
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const MessageItem = (props: MessageProps) => {
  return (
    <View style={props.message.isBot ? styles.botMessage : styles.userMessage}>
      <Text>{props.message.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chatArea: {
    flex: 1,
    backgroundColor: '#36393f',
    padding: 10,
  },
  messagesContainer: {
    flex: 1,
    marginTop: 10,
  },
  messagesList: {
    paddingVertical: 10,
  },
  botMessage: {
    backgroundColor: '#d3d3d3',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatArea;
