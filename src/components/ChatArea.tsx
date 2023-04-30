import React, { useRef, useState, useEffect } from "react"
import { StyleSheet, FlatList, View, NativeSyntheticEvent, NativeScrollEvent } from "react-native"
import MessageItem from "./MessageItem"
import ChatAreaInput from "./ChatAreaInput"
import ChatHomepage from "./ChatHomepage"
import { selectAuth } from "../redux/authSlice"
import { selectMessagesByScreenId } from "../redux/messageSlice"
import { useSelector } from "react-redux"
import { initializeOpenAIAPI } from "../services/openai"
import { RootState } from "../redux/store"
import isEqual from "lodash/isEqual"

function ChatArea({ ...props }) {
  const { screen } = props
  const flatListRef = useRef<FlatList>(null)
  const [travelEndButton, setTravelEndButton] = useState(false)
  const auth = useSelector(selectAuth)
  const messages = useSelector((state: RootState) => selectMessagesByScreenId(state, screen.id), isEqual)

  useEffect(() => {
    if (auth.isAuthorized) {
      initializeOpenAIAPI(auth.apiKey)
    }
  }, [auth.apiKey])

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y
    const contentHeight = event.nativeEvent.contentSize.height
    const layoutHeight = event.nativeEvent.layoutMeasurement.height

    offsetY < contentHeight - layoutHeight ? setTravelEndButton(true) : setTravelEndButton(false)
  }

  const ChatAreaInputProps = {
    flatListRef: flatListRef,
    travelEndButton: travelEndButton,
    screen: screen,
  }

  return (
    <View style={styles.chatArea}>
      {messages.length ? (
        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            inverted={false}
            onScroll={handleScroll}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => <MessageItem message={item} />}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListFooterComponent={<View style={styles.listFooter}></View>}
          />
        </View>
      ) : (
        <ChatHomepage />
      )}
      {auth.isAuthorized && <ChatAreaInput {...ChatAreaInputProps} />}
    </View>
  )
}

const styles = StyleSheet.create({
  chatArea: {
    color: "#fff",
    flex: 1,
    width: "100%",
    backgroundColor: "rgb(52,53,65)",
  },
  messagesContainer: {
    flex: 1,
    color: "white",
  },
  messagesList: {
    paddingVertical: 0,
  },
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
  listFooter: {
    padding: 20,
    height: 200,
  },
  endButton: {},
  endButtonContainer: {
    backgroundColor: "transparent",
    textAlign: "right",
    marginRight: 20,
    height: 50,
  },
})

export default React.memo(ChatArea)
