import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useWindowDimensions, FlatList, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerActions
} from '@react-navigation/drawer';
import ChatArea from './ChatArea';
import Config from './Config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

function CustomDrawerContent(props: any) {
  const clonedArray = structuredClone(props.screens)
  const [screensDeepCopy, setScreensDeepCopy] = useState(clonedArray)

  const addFolder = () => {
    console.log('addFolder')
  }

  const addScreen = () => {
    props.setScreens((prevState) => [
      ...prevState,
      { id: prevState.length + 1, name: `Chat ${prevState.length + 1}`, title: `Chat ${prevState.length + 1}`, component: 'chat' },
    ]);
    setScreensDeepCopy((prevState) => [
      ...prevState,
      { id: prevState.length + 1, name: `Chat ${prevState.length + 1}`, title: `Chat ${prevState.length + 1}`, component: 'chat', edit: false },
    ]);
  };

  const onChangeText = (text, index) => {
    setScreensDeepCopy((prevState) => {
      return prevState.map((input) => input.id === index ? { ...input, title: text } : input)
    })
  }

  const editChat = (index) => {
    setScreensDeepCopy((prevState) => {
      return prevState.map((input) => input.id === index ? { ...input, edit: true } : input)
    })
  }
  const deleteChat = () => {
    console.log('deleteChat')
  }

  const handleSubmit = (text, index: number) => {
    onChangeText(text, index)
    onSubmit(index)
  }

  const onSubmit = (index) => {
    setScreensDeepCopy((prevState) => {
      prevState.forEach((screen) => {
        if (screen.id === index) {
          screen.edit = false;
          if (!screen.title) {
            screen.title = props.screens.filter(screen => screen.id === index)[0]["title"]
          }
        }
      })
      return prevState.map((input) => input.id === index ? { ...input, edit: false } : input)
    })
    props.setScreens((prevState) => {
      screensDeepCopy.forEach((screen) => {
        if (screen.id === index && screen.title) {
          screen.title = prevState.filter(screen => screen.id === index)[0]["title"]
        }
      })
      return [...prevState]
    })
    return
  }


  const onCancel = (index) => {
    setScreensDeepCopy((prevState) => {
      prevState.forEach((screen) => {
        if (screen.id === index) {
          screen.edit = false;
          screen.title = props.screens.filter(screen => screen.id === index)[0]["title"]
        }
      })
      return prevState.map((input) => input.id === index ? { ...input, edit: false } : input)
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.newChat}>
        <TouchableOpacity style={[styles.addButton, styles.addFolder]} onPress={addFolder}>
          <AntDesign name="addfolder" size={20} color='white' />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, styles.addChat]} onPress={addScreen}>
          <MaterialCommunityIcons name="chat-plus-outline" size={20} color='white' />
        </TouchableOpacity>
      </View>
      <View style={{ borderBottomWidth: 2, borderBottomColor: 'gray' }} />
      <View style={styles.drawerContentScrollView}>
        {screensDeepCopy.map((screen) => {
          return (
            !screen.edit ?
              (<TouchableOpacity key={screen.id} style={styles.chatButton} onPress={(e) => props.navigation.navigate(screen.name)}>
                <View style={styles.drawerLabel}>
                  <Ionicons name="chatbox-outline" size={20} color='white' />
                  <Text style={styles.drawerText}>{screen.title}</Text>
                  <View style={styles.drawerEndIcons} >
                    <TouchableOpacity onPress={() => editChat(screen.id)}>
                      <FeatherIcons name="edit-3" size={20} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteChat}>
                      <FeatherIcons name="trash-2" size={20} color='white' />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>) :
              (<TouchableOpacity key={screen.id} style={styles.chatButton} onPress={() => props.navigation.navigate(screen.name)}>
                <View style={styles.drawerLabel}>
                  <Ionicons name="chatbox-outline" size={20} color='white' />
                  <View style={styles.drawerTextContainer}>
                    <TextInput
                      style={styles.drawerTextInput}
                      placeholder={screen.title}
                      value={screen.title}
                      onChangeText={(text) => onChangeText(text, screen.id)}
                      onSubmitEditing={({ nativeEvent: { text, _eventCount, _target } }) => handleSubmit(text, screen.id)}
                    />
                  </View>
                  <View style={styles.drawerEndIcons} >
                    <TouchableOpacity onPress={() => onSubmit(screen.id)}>
                      <Ionicons name="checkmark-sharp" size={20} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onCancel(screen.id)}>
                      <Entypo name="cross" size={20} color='white' />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>)
          )
        })}
      </View>
      <View style={{ borderBottomWidth: 2, borderBottomColor: 'gray' }} />
    </View>
  );
}

const Drawer = createDrawerNavigator();

function Sidebar() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  const [screens, setScreens] = useState([
    { id: 1, name: 'Chat 1', title: 'help', component: 'chat' },
    { id: 2, name: 'Chat 2', title: 'hello', component: 'chat' }
  ])

  return (
    <Drawer.Navigator
      useLegacyImplementation
      backBehavior="history"
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
          name={screen.name}
          component={screen.component === 'chat' ? ChatArea : Config}
          options={{
            headerShown: !isLargeScreen,
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
  },
  drawerStyleSmallScreen: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  drawerItem: {
    color: 'gray',
  },
  drawerLabel: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  drawerText: {
    flex: 0.85,
    color: 'white',
  },
  drawerTextContainer: {
    marginLeft: 9,
    marginRight: -20,
    marginBottom: 4,
  },
  drawerTextInput: {
    flex: 1,
    paddingLeft: 2,
    paddingRight: 2,
    color: 'white',
  },
  drawerEndIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 10
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
    height: 700,
    margin: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  chatButton: {
    color: '#8f6dbd',
    backgroundImage: 'linear-gradient(to right, #4776E6 0%, #8E54E9  51%, #4776E6  100%)',
    borderRadius: 10,
    margin: 10,
    padding: 20
  }
})


export default Sidebar;
