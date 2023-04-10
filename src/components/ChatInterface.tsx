import React from 'react';
import { View, StyleSheet } from 'react-native';
import ChatArea from './ChatArea/ChatArea';
import Sidebar from './Sidebar/Sidebar';

function ChatInterface() {
  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <Sidebar />
      </View>
      <View style={styles.chatArea}>
        <ChatArea />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  sidebar: {
    flex: 2,
  },
  chatArea: {
    flex: 8,
  },
});

export default ChatInterface;