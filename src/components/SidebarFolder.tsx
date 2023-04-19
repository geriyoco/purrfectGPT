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
    <View style={styles.folderContainer}>
      <TouchableOpacity
        onPress={() => toggleExpand(props.folder.id)}
        onLongPress={() => editFolder(props.folder.id)}
        delayLongPress={300}
      >
        <View style={styles.folderHeader}>
          {props.folder.expand ?
            (<AntDesign style={styles.folderIcon} name="down" size={10} color='white' />) :
            (<AntDesign style={styles.folderIcon} name="right" size={10} color='white' />)
          }
          <Text style={styles.folderTitle}>{props.folder.title}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.folderContents}>
        <View style={styles.chatsContainer}>
          {props.folder.expand && props.folder.chatIds.length !== 0 && props.screens.filter((screen) => props.folder.chatIds.includes(screen.id)).map((screen) => (
            <View style={styles.chatItem} key={screen.id}>
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
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  folderContainer: {
    margin: 2,
    padding: 2
  },
  folderHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  folderIcon: {
    marginRight: 10,
  },
  folderTitle: {
    color: 'gray',
  },
  folderContents: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: 'black',
  },
  chatsContainer: {
    width: '100%',
    flexDirection: 'column'
  },
  chatItem: {
    width: '100%',
    flexDirection: 'row'
  },
  verticalDivider: {
    margin: 4.5,
    height: '100%',
    width: 1,
    backgroundColor: 'purple',
  }
})

export default SidebarFolder