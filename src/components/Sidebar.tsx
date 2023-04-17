import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect } from 'react';
import { StyleSheet, useWindowDimensions, TouchableOpacity, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChatArea from './ChatArea';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SidebarChat from './SidebarChat';
import SidebarFolder from './SidebarFolder';

function CustomDrawerContent(props: any) {
  const [folders, setFolders] = useState<Array<{ id: string, title: string, chats: Array<string>, expand: boolean, edit: boolean }>>([])
  const [newChat, setNewChat] = useState('')

  const addFolder = () => {
    const folderId = uuidv4()
    setFolders((prevState) => [...prevState, { id: folderId, title: `New Folder`, chats: [], expand: false, edit: false }])
  }

  const addChat = () => {
    const chatId = uuidv4()
    props.setScreens((prevState) => [...prevState, { id: chatId, title: `New Chat`, folderId: '', edit: false, focus: true }]);
    setNewChat(chatId)
  };

  useEffect(() => {
    onTouch(newChat ? newChat : props.screens[0]["id"]);
  }, [props.screens.length, newChat])

  const onTouch = (index) => {
    props.setScreens((prevState) => prevState.map((input) => input.id === index ? { ...input, focus: true } : { ...input, focus: false }))
    props.navigation.navigate(index)
  }

  return (
    <View style={styles.container}>
      <View style={styles.newChat}>
        <TouchableOpacity style={[styles.addButton, styles.addFolder]} onPress={addFolder}>
          <AntDesign name="addfolder" size={20} color='white' />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, styles.addChat]} onPress={addChat}>
          <MaterialCommunityIcons name="chat-plus-outline" size={20} color='white' />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={styles.drawerContentScrollView}>
        {folders && folders.map((folder, idx) => (
          <SidebarFolder
            key={folder.id}
            folder={folder}
            folders={folders}
            setFolders={setFolders}
            screens={props.screens}
            setScreens={props.setScreens}
            navigation={props.navigation}
            addChat={addChat}
            newChat={newChat}
            setNewChat={setNewChat}
            onTouch={onTouch}
          />
        ))}
        {props.screens.map((screen, idx) => {
          if (!screen.folderId) {
            return (
              <SidebarChat
                key={screen.id}
                screen={screen}
                screens={props.screens}
                setScreens={props.setScreens}
                navigation={props.navigation}
                folders={folders}
                setFolders={setFolders}
                newChat={newChat}
                addChat={addChat}
                setNewChat={setNewChat}
                onTouch={onTouch}
              />
            )
          }
          return null
        })}
      </View>
      <View style={styles.divider} />
      <View style={styles.footer} />
    </View >
  );
}


function Sidebar() {
  const Drawer = createDrawerNavigator();
  const { width, height } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const [screens, setScreens] = useState([
    { id: uuidv4(), title: 'New Chat #1', folderId: '', edit: false, focus: true },
  ])

  return (
    <Drawer.Navigator
      useLegacyImplementation
      backBehavior="history"
      initialRouteName="Feed"
      drawerContent={(props) => <CustomDrawerContent screens={screens} setScreens={setScreens} {...props} />}
      screenOptions={{
        drawerType: isLargeScreen ? 'permanent' : 'front',
        drawerStyle: isLargeScreen ? styles.drawerStyleLargeScreen : styles.drawerStyleSmallScreen,
        drawerActiveTintColor: 'white',
      }}
    >
      {screens.map((screen) => (
        <Drawer.Screen
          key={screen.id}
          name={screen.id}
          children={() => <ChatArea screens={screens} setScreens={setScreens} />}
          options={{
            headerShown: !isLargeScreen,
            headerStyle: styles.screenHeader,
            headerTitleStyle: styles.screenHeaderTitle,
            headerTintColor: 'purple',
            title: screen.title
          }} />
      ))}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerStyleLargeScreen: {
    width: 300,
    backgroundColor: 'black',
    borderRightColor: 'black',
  },
  drawerStyleSmallScreen: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  newChat: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 10
  },
  addButton: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
    padding: 20,
  },
  addChat: {
    backgroundImage: 'linear-gradient(to right, #4776E6 0%, #8E54E9  51%, #4776E6  100%)',
  },
  addFolder: {
    backgroundImage: 'linear-gradient(to right, #f857a6 0%, #ff5858  51%, #f857a6  100%)',
  },
  drawerContentScrollView: {
    overflowY: 'auto',
    flex: 1,
    maxHeight: 700,
    margin: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  divider: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'grey',
    marginVertical: 5,
  },
  screenHeader: {
    backgroundColor: 'black',
    borderBottomColor: 'black',
  },
  screenHeaderTitle: {
    color: 'white',
  },
  footer: {
    minHeight: 100
  }
})


export default Sidebar;
