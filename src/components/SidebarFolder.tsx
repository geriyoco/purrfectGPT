import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native"
import AntDesign from "react-native-vector-icons/AntDesign"
import SidebarChat from "./SidebarChat"
import SidebarFolderEditModal from "./SidebarFolderEditModal"
import { useDispatch, useSelector } from "react-redux"
import { toggleExpand, toggleEdit } from "../redux/folderSlice"
import { selectAllScreens } from "../redux/screenSlice";

function SidebarFolder({ ...props }) {
  const { folder } = props;
  const dispatch = useDispatch()
  const screens = useSelector(selectAllScreens)

  return (
    <View style={styles.folderContainer}>
      <TouchableOpacity
        onPress={() => dispatch(toggleExpand(folder.id))}
        onLongPress={() => dispatch(toggleEdit(folder.id))}
        delayLongPress={300}
      >
        <View style={styles.folderHeader}>
          {folder.expand ?
            (<AntDesign style={styles.folderIcon} name="down" size={10} color='white' />) :
            (<AntDesign style={styles.folderIcon} name="right" size={10} color='white' />)
          }
          <Text selectable={false} style={styles.folderTitle}>{folder.title}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.folderContents}>
        <View style={styles.chatsContainer}>
          {folder.expand
            && folder.chatIds.length !== 0
            && screens.filter((screen) => folder.chatIds.includes(screen.id)).map((screen) => (
              <View style={styles.chatItem} key={screen.id}>
                <View style={styles.verticalDivider}></View>
                <View style={{ flex: 1 }}>
                  <SidebarChat screen={screen} {...props} />
                </View>
              </View >
            ))}
        </View>
        {folder.edit &&
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