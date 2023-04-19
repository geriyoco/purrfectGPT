import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChatArea from './ChatArea';
import SidebarDrawerContent from './SidebarDrawerContent';

function Sidebar() {
  const Drawer = createDrawerNavigator();
  const { width, height } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const [screens, setScreens] = useState([
    { id: uuidv4(), title: 'New Chat', folderId: '', edit: false, focus: true },
  ])

  return (
    <Drawer.Navigator
      useLegacyImplementation
      backBehavior="history"
      initialRouteName="Feed"
      drawerContent={(props) => <SidebarDrawerContent screens={screens} setScreens={setScreens} {...props} />}
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
          children={() => <ChatArea />}
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
  screenHeader: {
    backgroundColor: 'black',
    borderBottomColor: 'black',
  },
  screenHeaderTitle: {
    color: 'white',
    textOverflow: 'ellipsis',
  },
})


export default Sidebar;
