import "./src/styles/styles.css"
import React from "react"
import { StyleSheet, View } from "react-native"
import ChatInterface from "./src/components/ChatInterface"
import { Provider } from "react-redux"
import { store, persistor } from "./src/redux/store"
import { PersistGate } from "redux-persist/integration/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <View style={styles.root}>
            <ChatInterface />
          </View>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
})

export default App
