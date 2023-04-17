import { Text, View, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

function HomePage() {
  return (
    <View style={styles.chatArea}>
      <Text style={styles.header}> Welcome to the purrfect chat! </Text>
      <FontAwesome5 style={styles.icon} name="cat" size={100} color="#fff" />
      <Text style={styles.caption}> Start by typing below! </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chatArea: {
    color: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgb(52,53,65)',
  },
  header: {
    textAlign: 'center',
    fontSize: 40,
    fontFamily: 'cursive'
  },
  icon: {
    padding: 10
  },
  caption: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'monospace'
  },
})

export default HomePage;