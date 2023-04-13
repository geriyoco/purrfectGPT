import React from 'react';
import { StyleSheet } from 'react-native';
import { useWindowDimensions } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import ChatArea from './ChatArea';
import Config from './Config';

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
const Drawer = createDrawerNavigator();

function Sidebar() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;

  return (
    <Drawer.Navigator
      useLegacyImplementation
      backBehavior="history"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: isLargeScreen ? 'permanent' : 'front',
        drawerStyle: isLargeScreen ? styles.drawerStyleLargeScreen : styles.drawerStyleSmallScreen,
        overlayColor: 'transparent',
      }}
    >
      <Drawer.Screen name="purrfectChat" component={ChatArea} options={{ headerShown: false }} />
      <Drawer.Screen name="Config" component={Config} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerStyleLargeScreen: {
    width: 300,
    backgroundColor: 'black',
    padding: 10,
  },
  drawerStyleSmallScreen: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
    padding: 10,
  },
})


export default Sidebar;
