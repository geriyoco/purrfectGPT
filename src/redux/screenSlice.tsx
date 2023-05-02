import { createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { v4 as uuidv4 } from "uuid"

export interface Screen {
  id: string
  title: string
  folderId: string
  edit: boolean
  focus: boolean
}

const initialId = uuidv4()
const initialState = {
  lastAddedScreenId: initialId,
  entities: {
    [initialId]: {
      id: initialId,
      title: "New Chat",
      folderId: "",
      edit: false,
      focus: false,
    },
  },
  ids: [initialId],
}

const screenSlice = createSlice({
  name: "screens",
  initialState,
  reducers: {
    addScreen: (state) => {
      const chatId = uuidv4()
      state.entities[chatId] = {
        id: chatId,
        title: `New Chat`,
        folderId: "",
        edit: false,
        focus: true,
      }
      state.ids.push(chatId)
      state.lastAddedScreenId = chatId
    },
    updateScreen: (state, action) => {
      const { screenId, title, folderId } = action.payload
      if (state.entities[screenId]) {
        state.entities[screenId].title = title ?? state.entities[screenId].title
        state.entities[screenId].folderId = folderId ?? state.entities[screenId].folderId
        state.entities[screenId].edit = false
      }
    },
    removeScreen: (state, action) => {
      const index = state.ids.indexOf(action.payload)
      if (index !== -1) {
        delete state.entities[action.payload]
        state.ids.splice(index, 1)
        state.lastAddedScreenId = ""
      }
    },
    toggleEdit: (state, action) => {
      if (state.entities[action.payload]) {
        state.entities[action.payload].edit = !state.entities[action.payload].edit
      }
    },
    toggleFocus: (state, action) => {
      Object.values(state.entities).forEach((screen) => {
        screen.focus = false
      })
      if (state.entities[action.payload]) {
        state.entities[action.payload].focus = true
      }
    },
    updateScreenFolders: (state, action) => {
      const { folderId, screenIds } = action.payload
      for (const [screenId, screen] of Object.entries(state.entities)) {
        screen.folderId = screenIds.includes(screenId) ? folderId : ""
      }
    },
    removeFolderFromScreens: (state, action) => {
      Object.values(state.entities).forEach((screen) => {
        if (screen.folderId === action.payload) {
          screen.folderId = ""
          screen.edit = false
        }
      })
    },
    removeAllScreens: (state) => {
      const chatId = uuidv4()
      state.entities = {
        [chatId]: {
          id: chatId,
          title: `New Chat`,
          folderId: "",
          edit: false,
          focus: true,
        },
      }
      state.ids = [chatId]
      state.lastAddedScreenId = chatId
    },
    addScreens: (state, action) => {
      const screens = action.payload
      state.entities = { ...state.entities, ...screens.entities }
      state.ids = screens.ids
      state.lastAddedScreenId = screens.lastAddedScreenId
    },
  },
})

export const selectScreenEntities = (state: RootState) => state.screens.entities
export const selectScreenIds = (state: RootState) => state.screens.ids
export const selectLastCreatedScreen = (state: RootState) => state.screens.lastAddedScreenId
export const selectFirstScreenId = createSelector(selectScreenIds, (ids) => ids[0])
export const selectScreenById = createSelector(
  [selectScreenEntities, (state, screenId) => screenId],
  (entities, screenId) => entities[screenId]
)
export const selectScreenTitle = createSelector(
  [selectScreenEntities, (state, screenId) => screenId],
  (entities, screenId) => entities[screenId].title
)
export const selectScreenFolderId = createSelector(
  [selectScreenEntities, (state, screenId) => screenId],
  (entities, screenId) => entities[screenId].folderId
)
export const selectScreenIdTitles = createSelector([selectScreenEntities], (entities) => {
  return Object.values(entities).map((screen) => {
    return {
      id: screen.id,
      title: screen.title,
    }
  })
})
export const selectScreensByFolderId = createSelector(
  [selectScreenEntities, (state, folderId) => folderId],
  (entities, folderId) => {
    return Object.values(entities)
      .filter((screen) => screen.folderId === folderId)
      .map((screen) => {
        return {
          id: screen.id,
          title: screen.title,
        }
      })
  }
)
export const selectScreenIdsFolderIds = createSelector(selectScreenEntities, selectScreenIds, (entities, screenIds) => {
  return screenIds
    .map((screenId) => ({
      screenId: screenId,
      folderId: entities[screenId]?.folderId,
    }))
    .filter((item) => item.folderId === "")
})
export const selectIsOnlyFolderLeft = createSelector(
  [selectScreenEntities, (state, folderId) => folderId],
  (entities, folderId) => {
    return Object.values(entities).filter((screen) => screen.folderId !== folderId).length === 0
  }
)
export const selectScreenIndex = createSelector([selectScreenIds, (state, screenId) => screenId], (ids, screenId) => {
  return ids.at(-1) === screenId && ids.at(0) === screenId
})

export const {
  addScreen,
  updateScreen,
  removeScreen,
  toggleEdit,
  toggleFocus,
  updateScreenFolders,
  removeFolderFromScreens,
  removeAllScreens,
  addScreens,
} = screenSlice.actions

export default screenSlice.reducer
