import React, { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import SidebarChat from "./SidebarChat"
import SidebarFolder from "./SidebarFolder"

function SidebarDrawerContent(props) {
  const [folders, setFolders] = useState<Array<{ id: string; title: string; chats: Array<string>; expand: boolean; edit: boolean }>>([])
  const [newChat, setNewChat] = useState("")

  const addFolder = () => {
    const folderId = uuidv4()
    setFolders((prevState) => [...prevState, { id: folderId, title: `New Folder`, chats: [], expand: false, edit: false }])
  }

  const addChat = () => {
    const chatId = uuidv4()
    props.setScreens((prevState: any) => [...prevState, { id: chatId, title: `New Chat`, folderId: "", edit: false, focus: true }])
    setNewChat(chatId)
  }

  useEffect(() => {
    onTouch(newChat ? newChat : props.screens[0]["id"])
  }, [props.screens.length, newChat])

  const onTouch = (index: any) => {
    props.setScreens((prevState: any[]) =>
      prevState.map((input: { id: any }) => (input.id === index ? { ...input, focus: true } : { ...input, focus: false }))
    )
    props.navigation.navigate(index)
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
          folders.map((folder, idx) => (
            <SidebarFolder
              key={folder.id}
              folder={folder}
              folders={folders}
              setFolders={setFolders}
              screens={props.screens}
              setScreens={props.setScreens}
              navigation={props.navigation}
              addChat={addChat}
              newChat={newChat}
              setNewChat={setNewChat}
              onTouch={onTouch}
            />
          ))}
        {props.screens.map((screen: { folderId: any; id: any }, idx: any) => {
          if (!screen.folderId) {
            return (
              <SidebarChat
                key={screen.id}
                screen={screen}
                screens={props.screens}
                setScreens={props.setScreens}
                navigation={props.navigation}
                folders={folders}
                setFolders={setFolders}
                newChat={newChat}
                addChat={addChat}
                setNewChat={setNewChat}
                onTouch={onTouch}
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
