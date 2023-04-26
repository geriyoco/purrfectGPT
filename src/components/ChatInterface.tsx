import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Sidebar from "./Sidebar";

function ChatInterface() {
  return (
    <NavigationContainer>
      <Sidebar />
    </NavigationContainer>
  );
}

export default ChatInterface;
