import React, { useState } from "react"
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { Dropdown } from "react-native-element-dropdown"
import AntDesign from "react-native-vector-icons/AntDesign"
import { useDispatch, useSelector } from "react-redux"
import {
  addScreen,
  removeScreen,
  selectScreenById,
  toggleEdit,
  updateScreen,
  selectScreenIndex,
  Screen
} from "../redux/screenSlice"
import { selectFolderIdTitles } from "../redux/folderSlice"
import isEqual from "lodash/isEqual"

function SidebarChatEditModal({ ...props }) {
  const { screenId } = props
  const screen = useSelector((state) => selectScreenById(state, screenId), isEqual)
  const isLastScreen = useSelector((state) => selectScreenIndex(state, screenId), isEqual)
  const folders = useSelector(selectFolderIdTitles, isEqual)
  const [isFocus, setIsFocus] = useState(false)
  const [editName, setEditName] = useState(screen.title)
  const [folderId, setFolderId] = useState(screen.folderId)
  const dispatch = useDispatch()

  const closeWithoutSubmit = (screenId: string) => {
    dispatch(toggleEdit(screenId))
  }

  const onSubmit = (screenId: string) => {
    dispatch(updateScreen({ screenId: screenId, title: editName, folderId: folderId }))
  }

  const onDelete = (screenId: string) => {
    if (isLastScreen) {
      dispatch(addScreen())
    }
    dispatch(removeScreen(screenId))
  }

  const unSelect = (item: Partial<Screen>, selected: boolean) => {
    !selected && item.id ? setFolderId(item.id) : setFolderId("")
    setIsFocus(false)
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={screen.edit}
      onRequestClose={() => closeWithoutSubmit(screenId)}
    >
      <TouchableWithoutFeedback onPress={() => closeWithoutSubmit(screenId)}>
        <View style={styles.editModal}>
          <TouchableWithoutFeedback>
            <View style={styles.editModalContainer}>
              <Text selectable={false} style={styles.editTitle}>
                Edit Chat
              </Text>
              <View style={styles.editSection}>
                <Text selectable={false} style={styles.editHeader}>
                  Name
                </Text>
                <TextInput
                  style={
                    editName === screen.title || !editName
                      ? [styles.textInput, { color: "gray" }]
                      : [styles.textInput, { color: "white" }]
                  }
                  autoFocus
                  placeholder={screen.title}
                  value={editName}
                  onChangeText={setEditName}
                />
              </View>
              {folders.length !== 0 && (
                <View style={styles.editSection}>
                  <Text selectable={false} style={styles.editHeader}>
                    Folder
                  </Text>
                  <Dropdown
                    data={folders}
                    search
                    searchPlaceholder="Search Folders..."
                    maxHeight={300}
                    backgroundColor="rgba(0,0,0,0.5)"
                    activeColor="gray"
                    placeholderStyle={{ color: "white" }}
                    style={[styles.dropdownContainer, { borderRadius: 10 }]}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemContainerStyle={{ borderRadius: 10 }}
                    containerStyle={styles.container}
                    labelField="title"
                    valueField="id"
                    placeholder={!isFocus ? "Select item" : "..."}
                    value={folderId}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                      setFolderId(item.id)
                      setIsFocus(false)
                    }}
                    renderItem={(item, selected = false) => {
                      return (
                        <TouchableOpacity onPress={() => unSelect(item, selected)}>
                          <View style={styles.item}>
                            <Text selectable={false} style={styles.textItem}>
                              {item.title}
                            </Text>
                            {item.id === folderId && (
                              <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                            )}
                          </View>
                        </TouchableOpacity>
                      )
                    }}
                    renderLeftIcon={() => (
                      <AntDesign style={styles.folderIcon} color={"white"} name="folderopen" size={20} />
                    )}
                  />
                </View>
              )}
              <View style={styles.editFooter}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(screenId)}>
                  <Text selectable={false} style={styles.delete}>
                    Delete Chat
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={() => onSubmit(screenId)}>
                  <Text selectable={false} style={styles.submit}>
                    Save
                  </Text>
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
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgb(200, 200, 200)",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    minWidth: 300,
    maxWidth: 400,
    maxHeight: 400,
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
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 20,
  },
  textInput: {
    backgroundColor: "black",
    borderRadius: 10,
    padding: 10,
    height: 55,
    marginBottom: 40,
    alignSelf: "stretch",
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
  dropdownContainer: {
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
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
})

export default React.memo(SidebarChatEditModal)
