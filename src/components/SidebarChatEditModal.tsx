import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Folder, SidebarChatEditModalProps } from '../types/sidebar';

function SidebarChatEditModal(props: SidebarChatEditModalProps) {
  const [editName, setEditName] = useState(props.screen.title)
  const [visible, setVisible] = useState(props.screen.edit)
  const [folderId, setFolderId] = useState(props.screen.folderId);
  const [isFocus, setIsFocus] = useState(false);

  const closeWithoutSubmit = (index: string) => {
    props.setScreens((prevState) => prevState.map((input) => input.id === index ? { ...input, edit: false } : input))
    setVisible(false)
  }

  const onSubmit = (index: string) => {
    props.setScreens((prevState) => prevState.map((input) =>
      input.id === index ? { ...input, title: editName ? editName : input.title, folderId: folderId, edit: false } : input
    ))
    props.setFolders((prevState) => prevState.map((folder) =>
      folder.id === folderId ?
        { ...folder, chats: !folder.chats.includes(index) ? [...folder.chats, index] : folder.chats } :
        { ...folder, chats: folder.chats.filter((id) => id !== index) }
    ))
    closeWithoutSubmit(index)
  }

  const onDelete = (index: string) => {
    if (props.screens.length === 1) {
      props.addChat()
    }
    props.setScreens((prevState) => prevState.filter(obj => obj.id !== index))
    props.setFolders((prevState) => prevState.map(folder => folder.id === props.screen.folderId ? { ...folder, chats: folder.chats.filter(id => id !== index) } : folder))
    props.setNewChat('')
  }

  const unSelect = (item: Folder, selected: boolean) => {
    !selected && item.id ? setFolderId(item.id) : setFolderId('')
    setIsFocus(false)
  }


  return (
    < Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => closeWithoutSubmit(props.screen.id)}
    >
      <TouchableWithoutFeedback onPress={() => closeWithoutSubmit(props.screen.id)}>
        <View style={styles.editModal}>
          <TouchableWithoutFeedback>
            <View style={styles.editModalContainer}>
              <Text style={styles.editTitle}>Edit Chat</Text>
              <View style={styles.editSection}>
                <Text style={styles.editHeader}>Name</Text>
                <TextInput
                  style={editName === props.screen.title || !editName ? [styles.textInput, { color: 'gray' }] : [styles.textInput, { color: 'white' }]}
                  placeholder={props.screen.title}
                  value={editName}
                  onChangeText={setEditName}
                />
              </View>
              {props.folders.length !== 0 &&
                <View style={styles.editSection}>
                  <Text style={styles.editHeader}>Folder</Text>
                  <Dropdown
                    data={props.folders}
                    search
                    searchPlaceholder="Search Folders..."
                    maxHeight={300}
                    backgroundColor='rgba(0,0,0,0.5)'
                    activeColor='gray'
                    placeholderStyle={{ color: 'white' }}
                    style={[styles.dropdownContainer, { borderRadius: 10 }]}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemContainerStyle={{ borderRadius: 10 }}
                    containerStyle={styles.container}
                    labelField="title"
                    valueField="id"
                    placeholder={!isFocus ? 'Select item' : '...'}
                    value={folderId}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                      setFolderId(item.id);
                      setIsFocus(false);
                    }}
                    renderItem={(item: Folder, selected: boolean = false) => {
                      return (
                        <TouchableOpacity onPress={() => unSelect(item, selected)}>
                          <View style={styles.item}>
                            <Text style={styles.textItem}>{item.title}</Text>
                            {item.id === folderId && (
                              <AntDesign
                                style={styles.icon}
                                color="black"
                                name="Safety"
                                size={20}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      )
                    }}
                    renderLeftIcon={() => (
                      <AntDesign
                        style={styles.folderIcon}
                        color={'white'}
                        name="folderopen"
                        size={20}
                      />
                    )}
                  />
                </View>
              }
              <View style={styles.editFooter}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(props.screen.id)}>
                  <Text style={styles.delete}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={() => onSubmit(props.screen.id)}>
                  <Text style={styles.submit}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal >
  )
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  editModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'gray',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  editModalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(200, 200, 200)',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    minWidth: 300,
    maxWidth: 400,
    maxHeight: 400,
  },
  editTitle: {
    fontSize: 30,
    fontFamily: 'cursive',
  },
  editHeader: {
    fontSize: 20,
    fontFamily: 'monospace',
  },
  editFooter: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  textInput: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 10,
    height: 55,
    marginBottom: 40,
    alignSelf: 'stretch'
  },
  editSection: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: 5,
  },
  submitButton: {
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  deleteButton: {
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#dc3545',
  },
  editFolder: {
    backgroundColor: 'black',
    color: 'white',
    zIndex: 1
  },
  folderIcon: {
    marginRight: 10
  },
  dropdownContainer: {
    backgroundColor: 'black',
    color: 'white',
    padding: 10,
  },
  submit: {
    fontFamily: 'cursive'
  },
  delete: {
    fontFamily: 'cursive'
  },
  selectedTextStyle: {
    color: 'white',
  },
  container: {
    borderRadius: 10,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
})

export default SidebarChatEditModal