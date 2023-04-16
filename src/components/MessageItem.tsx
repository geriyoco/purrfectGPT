import { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { FlatList, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { CreateCompletionResponseUsage } from 'openai';
import { Message } from '../types/message';
import { getPricing } from '../services/openai';

function MessageItem(props: {message: Message}) {
  const [metadataVisible, setMetadataVisible] = useState(false);
  const handleLongPress = () => setMetadataVisible(true);;
  const handleCloseMetadata = () => setMetadataVisible(false);

  const ProfileIcon = (
    <MaterialCommunityIcons
      name={props.message.isBot ? "robot-outline" : "face-man"}
      style={styles.profileIcon}
      size={20}
      color="#fff"
    />
  );

  const MessageContent = <MarkdownRenderedMessage text={props.message.text} />;

  return (
    <>
      {props.message.isBot ? (
        <TouchableOpacity onLongPress={handleLongPress} style={[styles.messageItem, styles.botMessage]}>
          {ProfileIcon}
          {MessageContent}
        </TouchableOpacity>
      ) : (
        <View style={[styles.messageItem, styles.userMessage]}>
          {ProfileIcon}
          {MessageContent}
        </View>
      )}

      <MetadataPopup
        visible={metadataVisible}
        onClose={handleCloseMetadata}
        created={props.message.created}
        model={props.message.model}
        usage={props.message.usage}
      />
    </>
  );
}

function MetadataPopup(props: {
  visible: boolean,
  onClose: () => void,
  created: number | undefined,
  model: string | undefined,
  usage: CreateCompletionResponseUsage | undefined,
}) {
  const created = props.created ? new Date(props.created * 1000).toLocaleString() : 'No date provided';
  const model = props.model ? props.model : 'No model provided';
  const usageData = {
    'Prompt': props.usage ? props.usage.prompt_tokens : 0,
    'Completion': props.usage ? props.usage.completion_tokens : 0,
    'Total': props.usage ? props.usage.total_tokens : 0,
  };

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
                    const [key, value] = item;
                    return (
                      <View style={styles.usageItem}>
                        <Text style={styles.usageKey}>{key + ":"}</Text>
                        <Text style={styles.usageValue}>{`${value} (USD ${getPricing(model, value).toFixed(6)})`}</Text>
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function MarkdownRenderedMessage(props: { text: string }) {
  return (
    <Text style={styles.markdownContainer}>
      <ReactMarkdown
        children={props.text}
        components={{
          p({ node, children, ...props }) {
            return (
              <Text {...props} style={{ marginVertical: 0 }}>
                {children}
              </Text>
            );
          },
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            console.log(match);
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, '')}
                style={dark}
                language={match[1]}
                PreTag="div"
              />
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            );
          }
        }}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      />
    </Text>
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
    backgroundColor: 'rgb(198,199,202)',
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
    fontWeight: 'bold',
    marginBottom: 5,
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  usageKey: {
    flex: 1,
  },
  usageValue: {
    flex: 2,
    textAlign: 'right',
    marginLeft: 15,
  },
  markdownContainer: {
    fontFamily: 'sans-serif',
    fontSize: 16,
  },
});

export default MessageItem;