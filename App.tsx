import "./src/styles/styles.css";
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ChatInterface from './src/components/ChatInterface';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react'


function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.root}>
          <ChatInterface />
        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default App;
