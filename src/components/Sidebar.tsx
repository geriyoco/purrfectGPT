import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useWindowDimensions, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
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

function CustomDrawerItem(title: string) {
  return (
    <View style={styles.drawerLabel}>
      <Text style={styles.drawerText}>{title}</Text>
      <View style={styles.drawerEndIcons} >
        <TouchableOpacity>
          <FeatherIcons name="edit-3" size={20} color='white' />
        </TouchableOpacity>
        <TouchableOpacity>
          <FeatherIcons name="trash-2" size={20} color='white' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

function CustomDrawerContent(props: any) {
  const navigation = useNavigation()
  console.log(props)

  const addFolder = () => {
    console.log('addFolder')
  }


  const addChat = () => {
    console.log('test')
    props.screen.push(DrawerScreen("Please"))
    // const routes = [
    //   ...props.state.routes.slice(0, -1),
    //   { name: "Home", params: undefined },
    //   props.state.routes[props.state.routes.length - 1],
    // ];

    // // requestAnimationFrame(() => {
    // //   navigation.dispatch(
    // //     CommonActions.reset({
    // //       ...props.state,
    // //       routes,
    // //       index: routes.length - 1
    // //     })
    // //   );
    // // });
    // navigation.dispatch(
    //   CommonActions.reset({
    //     ...props.state,
    //     routes,
    //     index: routes.length - 1
    //   }))
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label={() => {
          return (
            <View style={styles.newChat}>
              <TouchableOpacity style={styles.addButton} onPress={addFolder}>
                <AntDesign name="addfolder" size={20} color='white' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={addChat}>
                <MaterialCommunityIcons name="chat-plus-outline" size={20} color='white' />
              </TouchableOpacity>
            </View>
          )
        }}
        onPress={() => { }}
      />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
const Drawer = createDrawerNavigator();

function DrawerScreen(name: string) {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  return (
    <Drawer.Screen
      name={name}
      component={ChatArea}
      options={{
        headerShown: !isLargeScreen,
        drawerIcon: () => <Ionicons name="chatbox-outline" size={20} color='white' />,
        drawerLabel: () => CustomDrawerItem(name)
      }} />
  )
}

function Sidebar() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  const screens = [DrawerScreen("test"), DrawerScreen("Home")]

  return (
    <Drawer.Navigator
      useLegacyImplementation
      backBehavior="history"
      drawerContent={(props) => <CustomDrawerContent screen={screens} {...props} />}
      screenOptions={{
        drawerType: isLargeScreen ? 'permanent' : 'front',
        drawerStyle: isLargeScreen ? styles.drawerStyleLargeScreen : styles.drawerStyleSmallScreen,
        drawerActiveTintColor: 'white',
      }}
    >
      {screens.map((screen) => (
        screen
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
    marginRight: -20
  },
  drawerText: {
    flex: 0.9,
    color: 'white',
  },
  drawerEndIcons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 10
  },
  newChat: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginRight: -20
  },
  addButton: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginLeft: 10,
    marginRight: 10,
  }
})


export default Sidebar;
