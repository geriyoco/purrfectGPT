import React from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import SidebarChatEditModal from "./SidebarChatEditModal"
import { SidebarChatProps } from "../types/sidebar"

function SidebarChat(props: SidebarChatProps) {
  const editChat = (index: string) => {
    props.setScreens((prevState) => prevState.map(
      (input) => (input.id === index ? { ...input, edit: true } : input)
    ))
  }

  return (
    <TouchableOpacity
      style={[styles.button, props.screen.focus && styles.focus]}
      onPress={() => props.onChatTouch(props.screen.id)}
      onLongPress={() => editChat(props.screen.id)}
      delayLongPress={200}
    >
      <View style={[styles.label]}>
        <Ionicons style={styles.icon} name="chatbox-outline" size={20} color="white" />
        <Text
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {props.screen.title}
        </Text>
        {props.screen.edit && (
          <SidebarChatEditModal {...props} />
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  label: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 10,
  },
  title: {
    flex: 1,
    color: "white",
    overflow: "hidden",
  },
  button: {
    backgroundColor: "black",
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  focus: {
    backgroundImage: "linear-gradient(to right, #4776E6 0%, #8E54E9  51%, #4776E6  100%)",
  },
})

export default SidebarChat
