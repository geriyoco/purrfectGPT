import React, { useState, useEffect } from "react";
import { Text } from "react-native";

const TypingText = ({ text, speed, ...props }) => {
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setTypedText((typedText) => typedText + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <Text {...props}>{typedText}</Text>;
};

export default TypingText;
