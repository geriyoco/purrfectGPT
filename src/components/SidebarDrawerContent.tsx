import React, { CSSProperties, useRef } from "react"
import { StyleSheet, TouchableOpacity, View, Text } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import { useSelector, useDispatch } from "react-redux"
import { DrawerContentComponentProps } from "@react-navigation/drawer"
import { selectAllScreens, addScreen, removeAllScreens, addScreens } from "../redux/screenSlice"
import { selectAllFolders, addFolder, removeAllFolders, addFolders } from "../redux/folderSlice"
import { addMessages, removeAllMessages } from "../redux/messageSlice"
import { saveAs } from 'file-saver';
import { store } from "../redux/store"
import SidebarChat from "./SidebarChat"
import SidebarFolder from "./SidebarFolder"


function SidebarDrawerContent(props: DrawerContentComponentProps) {
  const dispatch = useDispatch()
  const fileInputRef: React.Ref<HTMLInputElement> = useRef(null)
  const screens = useSelector(selectAllScreens);
  const folders = useSelector(selectAllFolders);

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      const fileData = reader.result as string
      if (fileData) {
        (async function () {
          const response = await fetch(fileData);
          const data = await response.json();
          dispatch(addMessages(data.messages))
          dispatch(addFolders(data.folders))
          dispatch(addScreens(data.screens))
        })();
      }
    };
  };

  const downloadState = (state: any) => {
    const jsonState = JSON.stringify(state);
    const file = new Blob([jsonState], { type: 'application/json' });
    const now = new Date().toISOString();
    saveAs(file, `${now}-purrfectChats.json`);
  };

  const exportChat = () => {
    const state = store.getState()
    delete state.auth
    delete state._persist
    downloadState(state)
  }
  const importChat = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click();
    }
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
          <input ref={fileInputRef} id="files" type="file" onChange={handleFileChange} style={styles.fileUpload as CSSProperties} />
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
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  fileUpload: {
    display: 'none'
  }
})

export default SidebarDrawerContent
