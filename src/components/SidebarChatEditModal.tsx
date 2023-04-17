import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Dimensions, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

function SidebarChatEditModal(props) {
  const [editName, setEditName] = useState(props.screen.title)
  const [visible, setVisible] = useState(props.screen.edit)
  const [folderId, setFolderId] = useState(props.screen.folderId);
  const [isFocus, setIsFocus] = useState(false);

  const closeWithoutSubmit = (index) => {
    props.setScreens((prevState) => prevState.map((input) => input.id === index ? { ...input, edit: false } : input))
    setVisible(false)
  }

  const onSubmit = (index) => {
    props.setScreens((prevState) => prevState.map((input) =>
      input.id === index ? { ...input, title: editName ? editName : input.title, folderId: folderId, edit: false } : input
    ))
    props.setFolders((prevState) => prevState.map((folder) =>
      folder.id === folderId ? { ...folder, chats: !folder.chats.includes(index) ? [...folder.chats, index] : folder.chats } : { ...folder, chats: folder.chats.filter((id) => id !== index) }
    ))
    closeWithoutSubmit(index)
  }

  const onDelete = (index) => {
    if (props.screens.length === 1) {
      props.addChat()
    }
    props.setScreens((prevState) => prevState.filter(obj => obj.id !== index))
    props.setFolders((prevState) => prevState.map(folder => folder.id === props.screen.folderId ? { ...folder, chats: folder.chats.filter(id => id !== index) } : folder))
    props.setNewChat('')
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
                  style={editName === props.screen.title || !editName ? [styles.drawerTextInput, { color: 'gray' }] : [styles.drawerTextInput, { color: 'white' }]}
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
                    style={[styles.placeholder, { borderRadius: 10 }]}
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
    minWidth: 300,
    maxWidth: width * 0.5,
    maxHeight: height * 0.5
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
  },
  drawerTextInput: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 10,
    height: 40,
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
  placeholder: {
    backgroundColor: 'black',
    color: 'white',
    padding: 10,
    height: 40
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
})

export default SidebarChatEditModal