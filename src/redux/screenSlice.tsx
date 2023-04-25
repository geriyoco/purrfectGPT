import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { v4 as uuidv4 } from "uuid"

interface Screen {
  id: string
  title: string
  folderId: string
  edit: boolean
  focus: boolean
  messages: string[]
}

const initialId = uuidv4()
const initialState = {
  lastAddedScreenId: initialId,
  entities: [
    {
      id: initialId,
      title: "New Chat",
      folderId: "",
      edit: false,
      focus: false,
      messages: [],
    },
  ],
}

const screenSlice = createSlice({
  name: "screens",
  initialState,
  reducers: {
    addScreen: (state) => {
      // const chatId = action.payload
      const chatId = uuidv4()
      state.entities.push({ id: chatId, title: `New Chat`, folderId: "", edit: false, focus: true, messages: [] })
      state.lastAddedScreenId = chatId
    },
    updateScreen: (state, action) => {
      const { id, title, folderId } = action.payload
      return {
        ...state,
        entities: state.entities.map((screen) =>
          screen.id === id ? { ...screen, title: title ? title : screen.title, folderId: folderId, edit: false } : screen
        ),
      }
    },
    removeScreen: (state, action) => {
      return {
        ...state,
        entities: state.entities.filter((screen) => screen.id !== action.payload),
        lastAddedScreenId: "",
      }
    },
    toggleEdit: (state, action) => {
      return {
        ...state,
        entities: state.entities.map((screen) => (screen.id === action.payload ? { ...screen, edit: !screen.edit } : { ...screen, edit: false })),
      }
    },
    toggleFocus: (state, action) => {
      return {
        ...state,
        entities: state.entities.map((screen) => (screen.id === action.payload ? { ...screen, focus: true } : { ...screen, focus: false })),
      }
    },
    updateScreenFolders: (state, action) => {
      const { id, chatIds } = action.payload
      return {
        ...state,
        entities: state.entities.map((screen) =>
          chatIds.includes(screen.id) ? { ...screen, folderId: id, edit: false } : { ...screen, folderId: "", edit: false }
        ),
      }
    },
    removeFolderFromScreens: (state, action) => {
      return {
        ...state,
        entities: state.entities.filter((screen) => screen.folderId !== action.payload),
      }
    },
    updateScreenMessages: (state, action) => {
      const { screenId, messageIds } = action.payload
      return {
        ...state,
        entities: state.entities.map((screen) => (screen.id === screenId ? { ...screen, messages: messageIds } : { ...screen })),
      }
    },
    removeAllScreens: (state) => {
      return {
        ...state,
        entities: initialState.entities
      }
    }
  },
})

export const selectAllScreens = (state: RootState) => state.screens.entities
export const selectScreenById = (state: RootState, screenId: string) => state.screens.entities.find((screen) => screen.id === screenId)
export const selectLastCreatedScreen = (state: RootState) => state.screens.lastAddedScreenId

// Export the slice's reducer and actions
export const {
  addScreen,
  updateScreen,
  removeScreen,
  toggleEdit,
  toggleFocus,
  updateScreenFolders,
  removeFolderFromScreens,
  updateScreenMessages,
  removeAllScreens,
} = screenSlice.actions
export default screenSlice.reducer
