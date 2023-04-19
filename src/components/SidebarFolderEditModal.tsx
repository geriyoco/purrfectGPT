import React, { useState } from "react"
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { MultiSelect } from "react-native-element-dropdown"
import AntDesign from "react-native-vector-icons/AntDesign"
import { SidebarFolderProps } from "../types/sidebar"

function SidebarFolderEditModal(props: SidebarFolderProps) {
  const [editName, setEditName] = useState(props.folder.title)
  const [visible, setVisible] = useState(props.folder.edit)
  const [isFocus, setIsFocus] = useState(false)
  const [selectedChats, setSelectedChats] = useState(props.folder.chatIds)

  const closeWithoutSubmit = (index: string) => {
    props.setFolders((prevState) => prevState.map((input) => (input.id === index ? { ...input, edit: false } : input)))
    setVisible(false)
  }

  const onSubmit = (index: string) => {
    props.setFolders((prevState) =>
      prevState.map((input) =>
        input.id === index ? { ...input, title: editName ? editName : input.title, chatIds: selectedChats, edit: false } : input
      )
    )
    props.setScreens((prevState) =>
      prevState.map((input) =>
        selectedChats.includes(input.id) ? { ...input, folderId: index, edit: false } : { ...input, folderId: '', edit: false }
      )
    )
    closeWithoutSubmit(index)
  }

  const onDelete = (index: string) => {
    const screensToDelete = props.screens.filter((screen) => props.folder.chatIds.includes(screen.id))
    if (props.screens.length === screensToDelete.length) {
      props.addChat()
    }
    props.setFolders((prevState) => prevState.filter((obj) => obj.id !== index))
    props.setScreens((prevState) => prevState.filter((screen) => !props.folder.chatIds.includes(screen.id)))
    props.setNewChat("")
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={() => closeWithoutSubmit(props.folder.id)}>
      <TouchableWithoutFeedback onPress={() => closeWithoutSubmit(props.folder.id)}>
        <View style={styles.editModal}>
          <TouchableWithoutFeedback>
            <View style={styles.editModalContainer}>
              <Text style={styles.editTitle}>Edit Folder</Text>
              <View style={styles.editSection}>
                <Text style={styles.editHeader}>Name</Text>
                <TextInput
                  style={
                    editName === props.folder.title || !editName ? [styles.textInput, { color: "gray" }] : [styles.textInput, { color: "white" }]
                  }
                  placeholder={props.folder.title}
                  value={editName}
                  onChangeText={setEditName}
                />
              </View>
              <View style={styles.editSection}>
                <Text style={styles.editHeader}>Add Chats</Text>
                <MultiSelect
                  data={props.screens}
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
                        <Text style={styles.textSelectedStyle}>{item.title}</Text>
                        <AntDesign color="black" name="delete" size={17} />
                      </View>
                    </TouchableOpacity>
                  )}
                  renderLeftIcon={() => <AntDesign style={styles.folderIcon} color={"white"} name="folderopen" size={20} />}
                />
              </View>
              <View style={styles.editFooter}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(props.folder.id)}>
                  <Text style={styles.delete}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={() => onSubmit(props.folder.id)}>
                  <Text style={styles.submit}>Submit</Text>
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
