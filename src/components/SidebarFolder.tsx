import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import SidebarChat from "./SidebarChat"
import SidebarFolderEditModal from "./SidebarFolderEditModal"
import { SidebarFolderProps } from "../types/sidebar";

function SidebarFolder(props: SidebarFolderProps) {
  const toggleExpand = (index: string) => {
    props.setFolders((prevState) => prevState.map((input) => input.id === index ? { ...input, expand: !input.expand } : input))
  }

  const editFolder = (index: string) => {
    props.setFolders((prevState) => prevState.map((input) => input.id === index ? { ...input, edit: true } : input))
  }

  return (
    <TouchableOpacity
      style={styles.folderContainer}
      onPress={() => toggleExpand(props.folder.id)}
      onLongPress={() => editFolder(props.folder.id)}
      delayLongPress={300}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {props.folder.expand ?
          (<AntDesign style={styles.folderIcon} name="down" size={10} color='white' />) :
          (<AntDesign style={styles.folderIcon} name="right" size={10} color='white' />)
        }
        <Text style={styles.folderTitle}>{props.folder.title}</Text>
      </View>
      <View style={{ width: '100%', flexDirection: 'column' }}>
        {props.folder.expand && props.folder.chats.length !== 0 && props.screens.filter((screen) => props.folder.chats.includes(screen.id)).map((screen) => (
          <View style={{ width: '100%', flexDirection: 'row' }} key={screen.id}>
            <View style={styles.verticalDivider}></View>
            <View style={{ flex: 1 }}>
              <SidebarChat screen={screen} {...props} />
            </View>
          </View >
        ))}
      </View>
      {props.folder.edit &&
        <SidebarFolderEditModal {...props} />
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  folderContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: 'black',
    margin: 2,
    padding: 2
  },
  folderTitle: {
    color: 'gray',
  },
  folderIcon: {
    marginRight: 10,
  },
  verticalDivider: {
    margin: 4.5,
    height: '100%',
    width: 1,
    backgroundColor: 'purple',
  }
})

export default SidebarFolder