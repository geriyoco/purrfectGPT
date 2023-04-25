import React, { useState } from "react"
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { MultiSelect } from "react-native-element-dropdown"
import AntDesign from "react-native-vector-icons/AntDesign"
import { useDispatch, useSelector } from "react-redux"
import {
  addScreen,
  selectAllScreens,
  updateScreenFolders,
  removeFolderFromScreens,
} from "../redux/screenSlice"
import { removeFolder, toggleEdit as toggleEditFolder, updateFolder } from "../redux/folderSlice"

function SidebarFolderEditModal({ ...props }) {
  const { folder } = props
  const [editName, setEditName] = useState(folder.title)
  const [isFocus, setIsFocus] = useState(false)
  const [selectedChats, setSelectedChats] = useState(folder.chatIds)
  const dispatch = useDispatch()
  const screens = useSelector(selectAllScreens)

  const closeWithoutSubmit = (index: string) => {
    dispatch(toggleEditFolder(index))
  }

  const onSubmit = (index: string) => {
    dispatch(updateFolder({ id: index, title: editName, chatIds: selectedChats }))
    dispatch(updateScreenFolders({ id: index, chatIds: selectedChats }))
  }

  const onDelete = (index: string) => {
    const screensToDelete = screens.filter((screen) => folder.chatIds.includes(screen.id))
    if (screens.length === screensToDelete.length) {
      dispatch(addScreen())
    }
    dispatch(removeFolder(index))
    dispatch(removeFolderFromScreens(index))
  }

  return (
    <Modal animationType="fade" transparent={true} visible={folder.edit} onRequestClose={() => closeWithoutSubmit(folder.id)}>
      <TouchableWithoutFeedback onPress={() => closeWithoutSubmit(folder.id)}>
        <View style={styles.editModal}>
          <TouchableWithoutFeedback>
            <View style={styles.editModalContainer}>
              <Text selectable={false} style={styles.editTitle}>Edit Folder</Text>
              <View style={styles.editSection}>
                <Text selectable={false} style={styles.editHeader}>Name</Text>
                <TextInput
                  style={
                    editName === folder.title || !editName ? [styles.textInput, { color: "gray" }] : [styles.textInput, { color: "white" }]
                  }
                  autoFocus
                  placeholder={folder.title}
                  value={editName}
                  onChangeText={setEditName}
                />
              </View>
              <View style={styles.editSection}>
                <Text selectable={false} style={styles.editHeader}>Add Chats</Text>
                <MultiSelect
                  data={screens}
                  search
                  searchPlaceholder="Search Chats..."
                  maxHeight={300}
                  backgroundColor="rgba(0,0,0,0.5)"
                  activeColor="gray"
                  style={[styles.multiSelectContainer, { borderRadius: 10 }]}
                  placeholderStyle={{ color: "white" }}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemContainerStyle={{ borderRadius: 10 }}
                  containerStyle={styles.container}
                  labelField="title"
                  valueField="id"
                  placeholder={!isFocus ? "Select item" : "..."}
                  value={selectedChats}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item) => {
                    setSelectedChats(item)
                  }}
                  renderSelectedItem={(item, unSelect) => (
                    <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                      <View style={styles.selectedStyle}>
                        <Text selectable={false} style={styles.textSelectedStyle}>{item.title}</Text>
                        <AntDesign color="black" name="delete" size={17} />
                      </View>
                    </TouchableOpacity>
                  )}
                  renderLeftIcon={() => <AntDesign style={styles.folderIcon} color={"white"} name="folderopen" size={20} />}
                />
              </View>
              <View style={styles.editFooter}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(folder.id)}>
                  <Text selectable={false} style={styles.delete}>Delete Folder</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={() => onSubmit(folder.id)}>
                  <Text selectable={false} style={styles.submit}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  editModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "gray",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  editModalContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgb(200, 200, 200)",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    minWidth: 300,
    maxWidth: 400,
    minHeight: 300,
    maxHeight: 600,
  },
  editTitle: {
    fontSize: 30,
    fontFamily: "cursive",
  },
  editHeader: {
    fontSize: 20,
    fontFamily: "monospace",
  },
  editFooter: {
    marginTop: 20,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  textInput: {
    backgroundColor: "black",
    alignSelf: "stretch",
    borderRadius: 10,
    padding: 10,
    height: 55,
    marginBottom: 40,
  },
  editSection: {
    flexDirection: "column",
    alignSelf: "stretch",
    gap: 5,
  },
  submitButton: {
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
  },
  deleteButton: {
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    backgroundColor: "#dc3545",
  },
  editFolder: {
    backgroundColor: "black",
    color: "white",
    zIndex: 1,
  },
  folderIcon: {
    marginRight: 10,
  },
  multiSelectContainer: {
    backgroundColor: "black",
    color: "white",
    padding: 10,
  },
  submit: {
    fontFamily: "cursive",
  },
  delete: {
    fontFamily: "cursive",
  },
  selectedTextStyle: {
    color: "white",
  },
  container: {
    borderRadius: 10,
  },
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    padding: 10,
    margin: 5,
    marginLeft: 40,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
})

export default SidebarFolderEditModal
