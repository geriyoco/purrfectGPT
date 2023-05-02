import React from "react"
import { StyleSheet, useWindowDimensions } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import ChatArea from "./ChatArea"
import SidebarDrawerContent from "./SidebarDrawerContent"
import { useSelector } from "react-redux"
import { selectScreenIds, selectScreenTitle } from "../redux/screenSlice"
import isEqual from "lodash/isEqual"
import { RootState } from "../redux/store"

function Sidebar() {
  const Drawer = createDrawerNavigator()
  const { width } = useWindowDimensions()
  const isLargeScreen = width >= 768
  const screenIds = useSelector(selectScreenIds, isEqual)

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
      {screenIds &&
        screenIds.map((screenId) => (
          <Drawer.Screen
            key={screenId}
            name={screenId}
            children={() => <ChatArea screenId={screenId} />}
            options={{
              headerShown: !isLargeScreen,
              headerStyle: styles.screenHeader,
              headerTitleStyle: styles.screenHeaderTitle,
              headerTintColor: "purple",
              drawerLabel: () => {
                return useSelector((state: RootState) => selectScreenTitle(state, screenId), isEqual)
              },
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
