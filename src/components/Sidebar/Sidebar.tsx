import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';

function Sidebar() {
  const [open, setOpen] = React.useState(true);
  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerPosition="left"
      drawerType="permanent"
      renderDrawerContent={() => (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarItem}>Settings</Text>
          <Text style={styles.sidebarItem}>Profile</Text>
          <Text style={styles.sidebarItem}>Help</Text>
          <Text style={styles.sidebarItem}>Conversation History</Text>
        </View>
      )}
    >
    </Drawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sidebar: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 10,
    backgroundColor: '#36393f',
  },
  sidebarItem: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
  },
});

export default Sidebar;
