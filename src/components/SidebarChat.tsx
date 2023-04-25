import React, { useEffect } from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import SidebarChatEditModal from "./SidebarChatEditModal"
import { useDispatch, useSelector } from "react-redux"
import { selectAllScreens, selectLastCreatedScreen, toggleEdit, toggleFocus } from "../redux/screenSlice"

function SidebarChat({ ...props }) {
  const { navigation, screen, ...rest } = props
  const dispatch = useDispatch()
  const screens = useSelector(selectAllScreens)
  const lastAddedScreenId = useSelector(selectLastCreatedScreen)

  useEffect(() => {
    onTouch(lastAddedScreenId ? lastAddedScreenId : screens[0]["id"])
  }, [lastAddedScreenId])

  const onTouch = (screenId: string | undefined) => {
    if (screenId) {
      dispatch(toggleFocus(screenId))
      navigation.navigate(screenId);
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, screen.focus && styles.focus]}
      onPress={() => onTouch(screen.id)}
      onLongPress={() => dispatch(toggleEdit(screen.id))}
      delayLongPress={200}
    >
      <View style={[styles.label]}>
        <Ionicons style={styles.icon} name="chatbox-outline" size={20} color="white" />
        <Text
          selectable={false}
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {screen.title}
        </Text>
        {screen.edit && (
          <SidebarChatEditModal {...props} />
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  label: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    marginRight: 10,
  },
  title: {
    flex: 1,
    alignSelf: 'center',
    color: "white",
    overflow: "hidden",
  },
  button: {
    backgroundColor: "black",
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  focus: {
    backgroundImage: "linear-gradient(to right, #4776E6 0%, #8E54E9  51%, #4776E6  100%)",
  },
})

export default SidebarChat
