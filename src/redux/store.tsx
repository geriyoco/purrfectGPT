import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from 'redux-persist';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import screensReducer from "./screenSlice"
import foldersReducer from "./folderSlice"
import messagesReducer from "./messageSlice"
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from "./authSlice"

const encryptionKey = process.env.ENCRYPTION_KEY;

// Define the overall state shape of your store
interface RootState {
  folders: ReturnType<typeof foldersReducer>;
  screens: ReturnType<typeof screensReducer>;
  messages: ReturnType<typeof messagesReducer>;
  auth: ReturnType<typeof authReducer>;
}

// Define the root reducer that combines all slice reducers
const rootReducer = combineReducers({
  screens: screensReducer,
  folders: foldersReducer,
  messages: messagesReducer,
  auth: authReducer,
})

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [
    encryptTransform({
      secretKey: encryptionKey as string,
    })
  ],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
})

export const persistor = persistStore(store)
export type { RootState }
// export type RootState = ReturnType<typeof store.getState>
