import React, { CSSProperties, useRef } from "react"
import { StyleSheet, TouchableOpacity, View, Text, useWindowDimensions } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import { useSelector, useDispatch } from "react-redux"
import { addScreen, removeAllScreens, addScreens, selectScreenIdsFolderIds } from "../redux/screenSlice"
import { selectFolderIds, addFolder, removeAllFolders, addFolders } from "../redux/folderSlice"
import { addMessages, removeAllMessages } from "../redux/messageSlice"
import { saveAs } from "file-saver"
import { RootState, store } from "../redux/store"
import SidebarChat from "./SidebarChat"
import SidebarFolder from "./SidebarFolder"
import isEqual from "lodash/isEqual"
import cloneDeep from "lodash/cloneDeep"
import CustomViewStyle from "../types/CustomViewStyle"

function SidebarDrawerContent({ ...props }) {
  const { navigation } = props
  const dispatch = useDispatch()
  const { height } = useWindowDimensions()
  const fileInputRef: React.Ref<HTMLInputElement> = useRef(null)
  const screenIdsFolderIds = useSelector(selectScreenIdsFolderIds, isEqual)
  const folderIds = useSelector(selectFolderIds, isEqual)

  const fetchFileURI = async (fileData: string) => {
    const response = await fetch(fileData)
    const data = await response.json()
    dispatch(addMessages(data.messages))
    dispatch(addFolders(data.folders))
    dispatch(addScreens(data.screens))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const selectedFile = event.target.files[0]
    if (!selectedFile) return

    const reader = new FileReader()
    reader.readAsDataURL(selectedFile)
    reader.onload = () => {
      const fileData = reader.result as string
      if (fileData) {
        fetchFileURI(fileData)
      }
    }
  }

  const downloadState = (state: RootState) => {
    const jsonState = JSON.stringify(state)
    const file = new Blob([jsonState], { type: "application/json" })
    const now = new Date().toISOString()
    saveAs(file, `${now}-purrfectChats.json`)
  }

  const exportChat = () => {
    const state = store.getState()
    const stateCopy = cloneDeep(state)
    delete stateCopy.auth
    delete stateCopy._persist
    downloadState(stateCopy)
  }
  const importChat = () => {
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const removeAllChat = () => {
    dispatch(removeAllMessages())
    dispatch(removeAllFolders())
    dispatch(removeAllScreens())
  }

  return (
    <View style={[styles.container, { maxHeight: height }]}>
      <View style={styles.newChat}>
        <TouchableOpacity style={[styles.button, styles.addFolder, { flex: 1 }]} onPress={() => dispatch(addFolder())}>
          <AntDesign name="addfolder" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.addChat, { flex: 1 }]} onPress={() => dispatch(addScreen())}>
          <MaterialCommunityIcons name="chat-plus-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={[styles.drawerContentScrollView]}>
        {folderIds &&
          folderIds.map((folderId) => <SidebarFolder key={folderId} folderId={folderId} navigation={navigation} />)}
        {screenIdsFolderIds.map((screenIdFolderId) => {
          return (
            <SidebarChat key={screenIdFolderId.screenId} screenId={screenIdFolderId.screenId} navigation={navigation} />
          )
        })}
      </View>
      <View style={styles.divider} />
      <View style={styles.importExport}>
        <TouchableOpacity style={[styles.button, styles.importButton, styles.footerButtons]} onPress={importChat}>
          <MaterialCommunityIcons style={styles.bottomIcons} name="file-import-outline" size={20} color="white" />
          <Text style={styles.footerText}>Import</Text>
          <input
            ref={fileInputRef}
            id="files"
            type="file"
            onChange={handleFileChange}
            style={styles.fileUpload as CSSProperties}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.exportButton, styles.footerButtons]} onPress={exportChat}>
          <MaterialCommunityIcons style={styles.bottomIcons} name="file-export-outline" size={20} color="white" />
          <Text style={styles.footerText}>Export</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.button, styles.clearButton, styles.footerButtons]} onPress={removeAllChat}>
        <MaterialCommunityIcons style={styles.bottomIcons} name="trash-can-outline" size={20} color="white" />
        <Text style={styles.footerText}>Clear Conversations</Text>
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
    margin: 10,
  } as CustomViewStyle,
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
  } as CustomViewStyle,
  addFolder: {
    backgroundImage: "linear-gradient(to right, #f857a6 0%, #ff5858  51%, #f857a6  100%)",
  } as CustomViewStyle,
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
    backgroundImage: "linear-gradient(180deg, #000000 0%, #4776E6 )",
  } as CustomViewStyle,
  exportButton: {
    flex: 1,
    marginRight: 20,
    backgroundImage: "linear-gradient(180deg, #000000 0%, #8E54E9 )",
  } as CustomViewStyle,
  clearButton: {
    marginHorizontal: 20,
    backgroundImage: "linear-gradient(180deg, #000000 0%, #f857a6 )",
  } as CustomViewStyle,
  importExport: {
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  fileUpload: {
    display: "none",
  },
  bottomIcons: {
    marginRight: 2,
  },
  footerText: {
    color: "white",
  },
})

export default React.memo(SidebarDrawerContent)
