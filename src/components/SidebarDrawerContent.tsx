import React, { useEffect } from "react"
import { StyleSheet, TouchableOpacity, View, Text } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import SidebarChat from "./SidebarChat"
import SidebarFolder from "./SidebarFolder"
import { useSelector, useDispatch } from "react-redux"
import { selectAllScreens, addScreen, toggleFocus, selectLastCreatedScreen, removeAllScreens, selectScreenById } from "../redux/screenSlice"
import { selectAllFolders, addFolder, removeAllFolders } from "../redux/folderSlice"
import { DrawerContentComponentProps } from "@react-navigation/drawer"
import { removeAllMessages } from "../redux/messageSlice"

function SidebarDrawerContent(props: DrawerContentComponentProps) {
  const dispatch = useDispatch()
  const screens = useSelector(selectAllScreens);
  const folders = useSelector(selectAllFolders);

  const exportChat = () => {
    console.log("TODO export")
  }
  const importChat = () => {
    console.log("TODO import")
  }
  const removeAllChat = () => {
    dispatch(removeAllMessages())
    dispatch(removeAllFolders())
    dispatch(removeAllScreens())
  }

  return (
    <View style={styles.container}>
      <View style={styles.newChat}>
        <TouchableOpacity style={[styles.button, styles.addFolder, { flex: 1 }]} onPress={() => dispatch(addFolder())}>
          <AntDesign name="addfolder" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.addChat, { flex: 1 }]} onPress={() => dispatch(addScreen())}>
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
              {...props}
            />
          ))}
        {screens.map((screen, _idx) => {
          if (!screen.folderId) {
            return (
              <SidebarChat
                key={screen.id}
                screen={screen}
                {...props}
              />
            )
          }
          return null
        })}
      </View>
      <View style={styles.divider} />
      <View style={styles.importExport}>
        <TouchableOpacity style={[styles.button, styles.importButton, styles.footerButtons]} onPress={importChat}>
          <MaterialCommunityIcons name="file-import-outline" size={20} color="white" />
          <Text>Import</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.exportButton, styles.footerButtons]} onPress={exportChat}>
          <MaterialCommunityIcons name="file-export-outline" size={20} color="white" />
          <Text>Export</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.button, styles.clearButton, styles.footerButtons]} onPress={removeAllChat}>
        <MaterialCommunityIcons name="trash-can-outline" size={20} color="white" />
        <Text>Clear Conversations</Text>
      </TouchableOpacity>
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
  button: {
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
  importButton: {
    flex: 1,
    marginLeft: 20,
    backgroundImage: "linear-gradient(0deg, #4776E6 0%, #8E54E9  51%)",
  },
  exportButton: {
    flex: 1,
    marginRight: 20,
    backgroundImage: "linear-gradient(0deg, #4776E6 0%, #8E54E9  51%)",
  },
  clearButton: {
    marginHorizontal: 20,
    backgroundImage: "linear-gradient(0deg, #4776E6 0%, #8E54E9  51%)",
  },
  importExport: {
    justifyContent: 'space-evenly',
    flexDirection: "row",
  },
  footerButtons: { flexDirection: 'row', justifyContent: 'center' }
})

export default SidebarDrawerContent
