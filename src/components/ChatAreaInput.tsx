import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Keyboard,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getBotResponse, extractBotMessage } from "../services/openai";
import { selectAllMessages, addMessage } from "../redux/messageSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";

export interface ExtendedTextInputKeyPressEventData
  extends TextInputKeyPressEventData {
  shiftKey?: boolean;
}

function ChatAreaInput({ ...props }) {
  const { screen, flatListRef, travelEndButton } = props;
  const [currentMessage, setCurrentMessage] = useState("");
  const inputRef = useRef<TextInput>(null);
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) =>
    selectAllMessages(state, screen.id)
  );

  const handleSend = () => {
    dispatch(
      addMessage({ screenId: screen.id, text: currentMessage, isBot: false })
    );

    const botResponsePromise = getBotResponse(currentMessage, messages);
    botResponsePromise.then((botResponse) => {
      dispatch(
        addMessage({ screenId: screen.id, ...extractBotMessage(botResponse) })
      );
    });

    setCurrentMessage("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (
    e: NativeSyntheticEvent<ExtendedTextInputKeyPressEventData>
  ) => {
    if (
      e.nativeEvent.key === "Enter" &&
      currentMessage &&
      !e.nativeEvent.shiftKey
    ) {
      e.preventDefault();
      Keyboard.dismiss();
      handleSend();
    }
  };

  return (
    <View style={styles.bottomContainer}>
      <View style={styles.endButtonContainer}>
        {travelEndButton && (
          <TouchableOpacity
            style={styles.endButton}
            onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
          >
            <MaterialCommunityIcons
              name="arrow-down-circle"
              size={25}
              color="#fff"
            />
          </TouchableOpacity>
        )}
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
        <TouchableOpacity
          disabled={!currentMessage}
          style={styles.sendButton}
          onPress={handleSend}
        >
          <MaterialCommunityIcons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundImage: "linear-gradient(rgba(52,53,65,0),rgba(52,53,65) 50%)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    backgroundColor: "rgb(64,65,79)",
    color: "#FFF",
    width: "70%",
    height: 60,
    borderWidth: 1,
    padding: 10,
    borderColor: "rgba(32,33,35,.5)",
    borderRadius: 10,
  },
  sendButton: {
    backgroundColor: "rgb(64,65,79)",
    borderRadius: 8,
    padding: 12,
  },
  endButton: {},
  endButtonContainer: {
    backgroundColor: "transparent",
    textAlign: "right",
    marginRight: 20,
    height: 50,
  },
});

export default ChatAreaInput;
