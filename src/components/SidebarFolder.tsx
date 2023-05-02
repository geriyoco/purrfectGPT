import React from "react"
import { TouchableOpacity, View, StyleSheet, Text } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import SidebarChat from "./SidebarChat"
import SidebarFolderEditModal from "./SidebarFolderEditModal"
import { useDispatch, useSelector } from "react-redux"
import { toggleExpand, toggleEdit, selectFolderById } from "../redux/folderSlice"
import { selectScreensByFolderId } from "../redux/screenSlice"
import isEqual from "lodash/isEqual"

function SidebarFolder({ ...props }) {
  const { navigation, folderId } = props
  const dispatch = useDispatch()
  const screensByFolderId = useSelector((state) => selectScreensByFolderId(state, folderId), isEqual)
  const folder = useSelector((state) => selectFolderById(state, folderId), isEqual)

  return (
    <View style={styles.folderContainer}>
      <TouchableOpacity
        onPress={() => dispatch(toggleExpand(folderId))}
        onLongPress={() => dispatch(toggleEdit(folderId))}
        delayLongPress={300}
      >
        <View style={styles.folderHeader}>
          {folder.expand ? (
            <AntDesign style={styles.folderIcon} name="down" size={10} color="white" />
          ) : (
            <AntDesign style={styles.folderIcon} name="right" size={10} color="white" />
          )}
          <Text selectable={false} style={styles.folderTitle}>
            {folder.title}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.folderContents}>
        <View style={styles.chatsContainer}>
          {folder.expand &&
            screensByFolderId.map((screen) => (
              <View style={styles.chatItem} key={screen.id}>
                <View style={styles.verticalDivider}></View>
                <View style={{ flex: 1 }}>
                  <SidebarChat screenId={screen.id} navigation={navigation} />
                </View>
              </View>
            ))}
        </View>
        {folder.edit && <SidebarFolderEditModal folder={folder} />}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  folderContainer: {
    margin: 2,
    padding: 2,
  },
  folderHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  folderIcon: {
    marginRight: 10,
  },
  folderTitle: {
    color: "gray",
  },
  folderContents: {
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "black",
  },
  chatsContainer: {
    width: "100%",
    flexDirection: "column",
  },
  chatItem: {
    width: "100%",
    flexDirection: "row",
  },
  verticalDivider: {
    margin: 4.5,
    height: "100%",
    width: 1,
    backgroundColor: "purple",
  },
})

export default React.memo(SidebarFolder)
