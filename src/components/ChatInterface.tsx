import React from 'react';
import Sidebar from './Sidebar';
import { NavigationContainer } from '@react-navigation/native';

function ChatInterface() {
  return (
    <NavigationContainer>
      <Sidebar />
    </NavigationContainer>
  );
}

export default ChatInterface;