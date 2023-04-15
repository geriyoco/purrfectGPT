import { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Message } from '../types/message';

function MessageItem(props: {message: Message}) {
  const [metadataVisible, setMetadataVisible] = useState(false);
  const handleLongPress = () => setMetadataVisible(true);;
  const handleCloseMetadata = () => setMetadataVisible(false);

  return (
    <>
      <TouchableOpacity
        onLongPress={handleLongPress}
        style={[
          styles.messageItem,
          props.message.isBot ? styles.botMessage : styles.userMessage,
        ]}
      >
        <MaterialCommunityIcons
          name={props.message.isBot ? 'robot-outline' : 'face-man'}
          style={styles.profileIcon}
          size={20}
          color="#fff"
        />
        <Text style={styles.textMessage}>
          {props.message.text}
        </Text>
      </TouchableOpacity>

      <MetadataPopup
        visible={metadataVisible}
        onClose={handleCloseMetadata}
        metadata="dummy metadata"
      />
    </>
  );
}

function MetadataPopup(props: {visible: boolean, onClose: () => void, metadata: string}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={props.onClose}
    >
      <TouchableWithoutFeedback onPress={props.onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.metadataContainer}>
              <Text style={styles.metadataText}>{props.metadata}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  messageItem: {
    flex: 1,
    flexShrink: 1,
    flexDirection: 'row',
    color: 'white',
    padding: 20,
    alignItems: 'flex-start',
  },
  profileIcon: {
    paddingRight: 15,
  },
  botMessage: {
    backgroundColor: 'rgb(68,70,84)',
  },
  userMessage: {
    backgroundColor: 'rgb(52,53,65)',
  },
  textMessage: {
    flexShrink: 1,
    color: 'white'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  metadataContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: width * 0.5,
    height: height * 0.4,
    alignItems: 'center',
  },
  metadataText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MessageItem;