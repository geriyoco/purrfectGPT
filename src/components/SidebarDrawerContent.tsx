import React, { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import SidebarChat from "./SidebarChat"
import SidebarFolder from "./SidebarFolder"
import { SidebarProps, Folder } from "../types/sidebar"

function SidebarDrawerContent(props: SidebarProps) {
  const [folders, setFolders] = useState<Array<Folder>>([])
  const [newChat, setNewChat] = useState("")

  const addFolder = () => {
    const folderId = uuidv4()
    setFolders((prevState) => [...prevState, { id: folderId, title: `New Folder`, chatIds: [], expand: false, edit: false }])
  }

  const addChat = () => {
    const chatId = uuidv4()
    props.setScreens((prevState: any) => [...prevState, { id: chatId, title: `New Chat`, folderId: "", edit: false, focus: true }])
    setNewChat(chatId)
  }

  useEffect(() => {
    onTouch(newChat ? newChat : props.screens[0]["id"])
  }, [props.screens.length, newChat])

  const onTouch = (index: string) => {
    props.setScreens((prevState =>
      prevState.map((input) => (input.id === index ? { ...input, focus: true } : { ...input, focus: false }))
    ))
    props.navigation.navigate(index);
  }

  const SidebarDrawerContentProps = {
    folders: folders,
    setFolders: setFolders,
    addChat: addChat,
    newChat: newChat,
    setNewChat: setNewChat,
    onChatTouch: onTouch,
  }

  return (
    <View style={styles.container}>
      <View style={styles.newChat}>
        <TouchableOpacity style={[styles.addButton, styles.addFolder]} onPress={addFolder}>
          <AntDesign name="addfolder" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, styles.addChat]} onPress={addChat}>
          <MaterialCommunityIcons name="chat-plus-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={styles.drawerContentScrollView}>
        {folders &&
          folders.map((folder, _idx) => (
            <SidebarFolder
              key={folder.id}
              folder={folder}
              {...SidebarDrawerContentProps}
              {...props}
            />
          ))}
        {props.screens.map((screen, _idx) => {
          if (!screen.folderId) {
            return (
              <SidebarChat
                key={screen.id}
                screen={screen}
                {...SidebarDrawerContentProps}
                {...props}
              />
            )
          }
          return null
        })}
      </View>
      <View style={styles.divider} />
      <View style={styles.footer} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  drawerContentScrollView: {
    overflowY: "auto",
    flex: 1,
    maxHeight: 700,
    margin: 10,
  },
  newChat: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: 10,
  },
  addButton: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
    padding: 20,
  },
  addChat: {
    backgroundImage: "linear-gradient(to right, #4776E6 0%, #8E54E9  51%, #4776E6  100%)",
  },
  addFolder: {
    backgroundImage: "linear-gradient(to right, #f857a6 0%, #ff5858  51%, #f857a6  100%)",
  },
  divider: {
    height: 1,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "grey",
    marginVertical: 5,
  },
  footer: {
    minHeight: 100,
  },
})

export default SidebarDrawerContent
