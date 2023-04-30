import React from "react"
import { StyleSheet, useWindowDimensions } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import ChatArea from "./ChatArea"
import SidebarDrawerContent from "./SidebarDrawerContent"
import { useSelector } from "react-redux"
import { selectAllScreens } from "../redux/screenSlice"

function Sidebar() {
  const Drawer = createDrawerNavigator()
  const { width } = useWindowDimensions()
  const isLargeScreen = width >= 768
  const screens = useSelector(selectAllScreens)

  return (
    <Drawer.Navigator
      useLegacyImplementation
      backBehavior="history"
      initialRouteName="Feed"
      drawerContent={({ navigation }) => <SidebarDrawerContent navigation={navigation} />}
      screenOptions={{
        drawerType: isLargeScreen ? "permanent" : "front",
        drawerStyle: isLargeScreen ? styles.drawerStyleLargeScreen : styles.drawerStyleSmallScreen,
        drawerActiveTintColor: "white",
      }}
    >
      {screens &&
        screens.map((screen) => (
          <Drawer.Screen
            // navigationKey={screen.id}
            key={screen.id}
            name={screen.id}
            children={() => <ChatArea screen={screen} />}
            options={{
              headerShown: !isLargeScreen,
              headerStyle: styles.screenHeader,
              headerTitleStyle: styles.screenHeaderTitle,
              headerTintColor: "purple",
              title: screen.title,
            }}
          />
        ))}
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  drawerStyleLargeScreen: {
    width: 300,
    backgroundColor: "black",
    borderRightColor: "black",
  },
  drawerStyleSmallScreen: {
    flex: 1,
    width: "100%",
    backgroundColor: "black",
  },
  screenHeader: {
    backgroundColor: "black",
    borderBottomColor: "black",
  },
  screenHeaderTitle: {
    color: "white",
    textOverflow: "ellipsis",
  },
})

export default Sidebar
