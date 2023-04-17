import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Dimensions, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

function SidebarFolderEditModal(props) {
  const [editName, setEditName] = useState(props.folder.title)
  const [visible, setVisible] = useState(props.folder.edit)
  const [isFocus, setIsFocus] = useState(false);
  const [selectedChats, setSelectedChats] = useState(props.folder.chats);

  const closeWithoutSubmit = (index) => {
    props.setFolders((prevState) => prevState.map((input) => input.id === index ? { ...input, edit: false } : input))
    setVisible(false)
  }

  const onSubmit = (index) => {
    props.setFolders((prevState) => prevState.map((input) =>
      input.id === index ? { ...input, title: editName ? editName : input.title, chats: selectedChats, edit: false } : input
    ))
    props.setScreens((prevState) => prevState.map((input) => selectedChats.includes(input.id) ? { ...input, folderId: index, edit: false } : input))
    closeWithoutSubmit(index)
  }

  const onDelete = (index) => {
    const screensToDelete = props.screens.filter((screen) => props.folder.chats.includes(screen.id))
    if (props.screens.length === screensToDelete.length) {
      props.addChat()
    }
    props.setFolders((prevState) => prevState.filter(obj => obj.id !== index))
    props.setScreens((prevState) => prevState.filter((screen) => !props.folder.chats.includes(screen.id)))
    props.setNewChat('')
  }


  return (
    < Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => closeWithoutSubmit(props.folder.id)}
    >
      <TouchableWithoutFeedback onPress={() => closeWithoutSubmit(props.folder.id)}>
        <View style={styles.editModal}>
          <TouchableWithoutFeedback>
            <View style={styles.editModalContainer}>
              <Text style={styles.editTitle}>Edit Folder</Text>
              <View style={styles.editSection}>
                <Text style={styles.editHeader}>Name</Text>
                <TextInput
                  style={editName === props.folder.title || !editName ? [styles.drawerTextInput, { color: 'gray' }] : [styles.drawerTextInput, { color: 'white' }]}
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
                  backgroundColor='rgba(0,0,0,0.5)'
                  activeColor='gray'
                  style={[styles.placeholder, { borderRadius: 10 }]}
                  placeholderStyle={{ color: 'white' }}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemContainerStyle={{ borderRadius: 10 }}
                  containerStyle={styles.container}
                  labelField="title"
                  valueField="id"
                  placeholder={!isFocus ? 'Select item' : '...'}
                  value={selectedChats}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setSelectedChats(item);
                  }}
                  renderSelectedItem={(item, unSelect) => (
                    <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                      <View style={styles.selectedStyle}>
                        <Text style={styles.textSelectedStyle}>{item.title}</Text>
                        <AntDesign color="black" name="delete" size={17} />
                      </View>
                    </TouchableOpacity>
                  )}
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
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
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