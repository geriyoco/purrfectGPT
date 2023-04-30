import React, { useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  TextInputKeyPressEventData,
  NativeSyntheticEvent,
  Keyboard,
  ActivityIndicator,
} from "react-native"
import { TextInput, TouchableOpacity } from "react-native-gesture-handler"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import { initializeOpenAIAPI, listModels } from "../services/openai"
import { useDispatch, useSelector } from "react-redux"
import { setAuth, selectAuth } from "../redux/authSlice"
import { useQuery } from "@tanstack/react-query"

function ChatHomepage() {
  const [apiKey, setApiKey] = useState("")
  const dispatch = useDispatch()
  const auth = useSelector(selectAuth)
  const { isFetching, isError, refetch } = useQuery(["auth"], listModels, {
    enabled: false,
    onSuccess: () => {
      dispatch(setAuth({ apiKey: apiKey, isAuthorized: true }))
    },
    onError: () => {
      dispatch(setAuth({ apiKey: "", isAuthorized: false }))
    },
  })

  const onSubmit = () => {
    initializeOpenAIAPI(apiKey)
    refetch()
  }

  const handleKeyDown = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === "Enter") {
      e.preventDefault()
      Keyboard.dismiss()
      onSubmit()
    }
  }

  return (
    <View style={styles.chatArea}>
      <Text style={styles.header}> Welcome to the purrfectGPT! </Text>
      <FontAwesome5 style={styles.icon} name="cat" size={100} color="#fff" />
      {!auth.isAuthorized && (
        <View style={styles.inputSection}>
          <Text style={styles.caption}> Start by inputting your OpenAI API key! </Text>
          <View style={styles.labelAndTextInput}>
            <Text style={styles.inputLabel}>API Key :</Text>
            <TextInput
              textAlignVertical="bottom"
              style={styles.textInput}
              secureTextEntry={true}
              autoCapitalize="none"
              placeholder="Input API Key..."
              textContentType="password"
              keyboardType="visible-password"
              onKeyPress={handleKeyDown}
              value={apiKey}
              onChangeText={(text) => setApiKey(text)}
            />
          </View>
          {isError && <Text style={styles.inputError}> API Key is invalid </Text>}
          {isFetching && <ActivityIndicator style={styles.loadingIndicator} size="large" color="purple" />}
          <TouchableOpacity style={styles.submitButton} disabled={!apiKey} onPress={onSubmit}>
            <Text style={styles.caption}> Submit </Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.caption}>
        {" "}
        Please note that your chat conversations will not be saved, but you can choose to export the data{" "}
      </Text>
      {auth.isAuthorized && <Text style={styles.caption}> You can now start typing below! </Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  chatArea: {
    color: "#fff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgb(52,53,65)",
  },
  header: {
    textAlign: "center",
    fontSize: 40,
    fontFamily: "cursive",
  },
  icon: {
    padding: 10,
  },
  caption: {
    textAlign: "center",
    fontSize: 15,
    fontFamily: "monospace",
  },
  textInput: {
    backgroundColor: "rgb(64,65,79)",
    color: "#FFF",
    minWidth: "200px",
    width: "20%",
    height: 30,
    borderWidth: 0,
    padding: 10,
    borderColor: "rgba(32,33,35,.5)",
    borderRadius: 10,
  },
  inputError: {
    color: "red",
    paddingBottom: 10,
  },
  inputSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  labelAndTextInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  inputLabel: {
    color: "black",
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "rgb(64,65,79)",
    padding: 10,
  },
  loadingIndicator: {
    paddingBottom: 10,
  },
})

export default ChatHomepage
