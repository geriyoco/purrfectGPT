import React, { useEffect, useRef, useState } from "react"
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Keyboard,
} from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { getBotResponse, extractBotMessage } from "../services/openai"
import { selectMessagesByScreenId, addMessage, editMessage } from "../redux/messageSlice"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../redux/store"
import { useQuery } from "@tanstack/react-query"
import { v4 as uuidv4 } from "uuid"
import isEqual from "lodash/isEqual"

export interface ExtendedTextInputKeyPressEventData extends TextInputKeyPressEventData {
  shiftKey?: boolean
}

function ChatAreaInput({ ...props }) {
  const { screenId, flatListRef, travelEndButton } = props
  const [currentMessage, setCurrentMessage] = useState("")
  const [newMessageId, setNewMessageId] = useState("")
  const inputRef = useRef<TextInput>(null)
  const dispatch = useDispatch()
  const messages = useSelector((state: RootState) => selectMessagesByScreenId(state, screenId), isEqual)

  const { isFetching, refetch } = useQuery(
    [`getBotMessage${screenId}`],
    () => getBotResponse(currentMessage, messages),
    {
      enabled: false,
      onSuccess: (botResponse) => {
        dispatch(
          editMessage({
            id: newMessageId,
            screenId: screenId,
            isLoading: false,
            isError: false,
            ...extractBotMessage(botResponse),
          })
        )
      },
      onError: () => {
        dispatch(editMessage({ id: newMessageId, screenId: screenId, isBot: true, isLoading: false, isError: true }))
      },
    }
  )

  useEffect(() => {
    if (isFetching && newMessageId) {
      isFetching &&
        dispatch(addMessage({ id: newMessageId, screenId: screenId, isBot: true, isLoading: true, isError: false }))
    }
  }, [isFetching, newMessageId])

  const handleSend = () => {
    dispatch(
      addMessage({
        id: uuidv4(),
        screenId: screenId,
        text: currentMessage,
        isBot: false,
        isLoading: false,
        isError: false,
      })
    )
    setNewMessageId(uuidv4())
    refetch()
    setCurrentMessage("")
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: NativeSyntheticEvent<ExtendedTextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === "Enter" && currentMessage && !e.nativeEvent.shiftKey) {
      e.preventDefault()
      Keyboard.dismiss()
      handleSend()
    }
  }

  return (
    <View style={styles.bottomContainer}>
      <View style={styles.endButtonContainer}>
        {travelEndButton && (
          <TouchableOpacity
            style={styles.endButton}
            onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
          >
            <MaterialCommunityIcons name="arrow-down-circle" size={25} color="#fff" />
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
        <TouchableOpacity disabled={!currentMessage} style={styles.sendButton} onPress={handleSend}>
          <MaterialCommunityIcons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
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
})

export default React.memo(ChatAreaInput)
