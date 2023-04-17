import React from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import SidebarChatEditModal from "./SidebarChatEditModal"
import FeatherIcons from 'react-native-vector-icons/Feather';

function SidebarChat(props) {
  const editChat = (index) => {
    props.setScreens((prevState) => prevState.map((input) => input.id === index ? { ...input, edit: true } : input))
  }

  return (
    <TouchableOpacity
      style={[styles.chatButton, props.screen.focus && styles.drawerFocus]}
      onPress={() => props.onTouch(props.screen.id)}>
      <View style={[styles.drawerLabel]}>
        <Ionicons style={styles.drawerIcon} name="chatbox-outline" size={20} color='white' />
        <Text style={styles.drawerText}>{props.screen.title}</Text>
        {props.screen.focus &&
          <TouchableOpacity onPress={() => editChat(props.screen.id)}>
            <FeatherIcons name="edit-3" size={20} color='white' />
          </TouchableOpacity>
        }
        {props.screen.edit &&
          <SidebarChatEditModal
            screen={props.screen}
            screens={props.screens}
            setScreens={props.setScreens}
            setFolders={props.setFolders}
            folders={props.folders}
            addChat={props.addChat}
            setNewChat={props.setNewChat}
          />
        }
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  drawerLabel: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  drawerIcon: {
    marginRight: 10,
  },
  drawerText: {
    flex: 1,
    color: 'white',
  },
  chatButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    margin: 10,
    padding: 10
  },
  drawerFocus: {
    backgroundImage: 'linear-gradient(to right, #4776E6 0%, #8E54E9  51%, #4776E6  100%)',
  },
})

export default SidebarChat