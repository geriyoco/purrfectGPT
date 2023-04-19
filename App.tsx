import "./src/styles/styles.css";
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ChatInterface from './src/components/ChatInterface';

function App() {
  return (
    <View style={styles.root}>
      <ChatInterface />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default App;
