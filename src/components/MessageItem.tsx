import { useState } from "react"
import {
  Dimensions,
  StyleSheet,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  TextInput,
  NativeSyntheticEvent,
  Keyboard,
  ActivityIndicator,
} from "react-native"
import Clipboard from "@react-native-clipboard/clipboard"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import FeatherIcons from "react-native-vector-icons/Feather"
import EntypoIcons from "react-native-vector-icons/Entypo"
import { CreateCompletionResponseUsage } from "openai"
import { getPricing } from "../services/openai"
import { removeMessage, updateMessage } from "../redux/messageSlice"
import { useDispatch } from "react-redux"
import { ExtendedTextInputKeyPressEventData } from "./ChatAreaInput"

function MessageItem({ ...props }) {
  const { id, isBot, text, created, model, usage, isLoading, isError } = props.message
  const [metadataVisible, setMetadataVisible] = useState(false)
  const handleLongPress = () => setMetadataVisible(true)
  const handleCloseMetadata = () => setMetadataVisible(false)
  const [height, setHeight] = useState(0)
  const [actions, setActions] = useState(false)
  const [editAction, setEditAction] = useState(false)
  const [deleteAction, setDeleteAction] = useState(false)
  const [editText, setEditText] = useState(text)
  const dispatch = useDispatch()

  const copyToClipboard = () => {
    Clipboard.setString(text)
  }

  const deleteMessage = () => {
    dispatch(removeMessage({ messageId: id }))
  }

  const editMessage = () => {
    dispatch(updateMessage({ messageId: id, text: editText }))
  }

  const handleKeyDown = (e: NativeSyntheticEvent<ExtendedTextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === "Enter" && editText) {
      e.preventDefault()
      Keyboard.dismiss()
      editMessage()
    }
  }

  const updateSize = (height: number) => {
    setHeight(height)
  }

  const confirmAction = () => {
    editAction && editMessage()
    deleteAction && deleteMessage()
    setActions(false)
    setEditAction(false)
    setDeleteAction(false)
  }

  const refuseAction = () => {
    setActions(false)
    setEditText("")
    setEditAction(false)
    setDeleteAction(false)
  }

  const editMode = () => {
    setActions(true)
    setEditAction(true)
    setDeleteAction(false)
  }

  const deleteMode = () => {
    setActions(true)
    setDeleteAction(true)
    setEditAction(false)
  }

  const renderIcon = () => {
    if (isLoading) {
      return <ActivityIndicator size="small" color="purple" />
    }
    if (isError) {
      return (
        <MaterialCommunityIcons
          name={isBot ? "robot-dead-outline" : "face-man"}
          style={styles.profileIcon}
          size={20}
          color="#fff"
        />
      )
    }
    return (
      <MaterialCommunityIcons
        name={isBot ? "robot-outline" : "face-man"}
        style={styles.profileIcon}
        size={20}
        color="#fff"
      />
    )
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={isBot ? 0.2 : 1}
        onLongPress={isBot ? handleLongPress : undefined}
        style={[styles.messageItem, isBot ? styles.botMessage : styles.userMessage]}
      >
        {renderIcon()}
        {editAction ? (
          <TextInput
            style={[styles.textMessage, { height: height }]}
            autoFocus
            multiline
            onContentSizeChange={(e) => updateSize(e.nativeEvent.contentSize.height)}
            placeholder={text}
            value={editText}
            onChangeText={setEditText}
            onKeyPress={handleKeyDown}
          />
        ) : (
          <Text selectable={true} style={styles.textMessage}>
            {text}
          </Text>
        )}
        <TouchableOpacity onPress={copyToClipboard}>
          <MaterialCommunityIcons name="content-copy" style={styles.profileIcon} size={20} color="#fff" />
        </TouchableOpacity>
        {actions ? (
          <>
            <TouchableOpacity onPress={() => confirmAction()}>
              <FeatherIcons name={"check"} style={styles.profileIcon} size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => refuseAction()}>
              <EntypoIcons name={"cross"} style={styles.profileIcon} size={20} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => editMode()}>
              <FeatherIcons name="edit-3" style={styles.profileIcon} size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteMode()}>
              <FeatherIcons name="trash-2" style={styles.profileIcon} size={20} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </TouchableOpacity>

      <MetadataPopup
        visible={metadataVisible}
        onClose={handleCloseMetadata}
        created={created}
        model={model}
        usage={usage}
      />
    </>
  )
}

function MetadataPopup(props: {
  visible: boolean
  onClose: () => void
  created: number | undefined
  model: string | undefined
  usage: CreateCompletionResponseUsage | undefined
}) {
  const created = props.created ? new Date(props.created * 1000).toLocaleString() : "No date provided"
  const model = props.model ? props.model : "No model provided"
  const usageData = {
    Prompt: props.usage ? props.usage.prompt_tokens : 0,
    Completion: props.usage ? props.usage.completion_tokens : 0,
    Total: props.usage ? props.usage.total_tokens : 0,
  }

  return (
    <Modal animationType="fade" transparent={true} visible={props.visible} onRequestClose={props.onClose}>
      <TouchableWithoutFeedback onPress={props.onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.metadataContainer}>
              <View style={styles.metadataCategory}>
                <Text style={styles.metadataTitle}>MODEL</Text>
                <Text>{model}</Text>
              </View>

              <View style={styles.metadataCategory}>
                <Text style={styles.metadataTitle}>CREATED</Text>
                <Text>{created}</Text>
              </View>

              <View style={styles.metadataCategory}>
                <Text style={styles.metadataTitle}>TOKEN USAGE</Text>
                <FlatList
                  data={Object.entries(usageData)}
                  renderItem={({ item }) => {
                    const [key, value] = item
                    return (
                      <View style={styles.usageItem}>
                        <Text style={styles.usageKey}>{key + ":"}</Text>
                        <Text style={styles.usageValue}>{`${value} (USD ${getPricing(model, value).toFixed(6)})`}</Text>
                      </View>
                    )
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const { width } = Dimensions.get("window")
const styles = StyleSheet.create({
  messageItem: {
    flex: 1,
    flexShrink: 1,
    flexDirection: "row",
    color: "white",
    padding: 20,
    alignItems: "flex-start",
  },
  profileIcon: {
    paddingRight: 15,
  },
  botMessage: {
    backgroundColor: "rgb(68,70,84)",
  },
  userMessage: {
    backgroundColor: "rgb(52,53,65)",
  },
  textMessage: {
    marginRight: 10,
    flex: 1,
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  metadataContainer: {
    backgroundColor: "rgb(198,199,202)",
    borderRadius: 10,
    padding: 20,
    minWidth: width * 0.3,
  },
  metadataCategory: {
    marginTop: 7,
    marginBottom: 7,
  },
  metadataTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  usageItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  usageKey: {
    flex: 1,
  },
  usageValue: {
    flex: 2,
    textAlign: "right",
    marginLeft: 15,
  },
})

export default MessageItem
