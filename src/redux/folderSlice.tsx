import { createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { v4 as uuidv4 } from "uuid"

export interface Folder {
  id: string
  title: string
  edit: boolean
  expand: boolean
}

const folderSlice = createSlice({
  name: "folders",
  initialState: {
    entities: {} as Record<string, Folder>,
    ids: [] as string[],
  },
  reducers: {
    addFolder: (state) => {
      const folderId = uuidv4()
      state.entities[folderId] = {
        id: folderId,
        title: "New Folder",
        edit: false,
        expand: false,
      }
      state.ids.push(folderId)
    },
    updateFolder: (state, action) => {
      const { id, title } = action.payload
      const folder = state.entities[id]
      if (folder) {
        folder.title = title ? title : folder.title
        folder.edit = false
      }
    },
    removeFolder: (state, action) => {
      const folderId = action.payload
      delete state.entities[folderId]
      state.ids = state.ids.filter((id) => id !== folderId)
    },
    toggleEdit: (state, action) => {
      const folderId = action.payload
      const folder = state.entities[folderId]
      if (folder) {
        folder.edit = !folder.edit
      }
    },
    toggleExpand: (state, action) => {
      const folderId = action.payload
      const folder = state.entities[folderId]
      if (folder) {
        folder.expand = !folder.expand
      }
    },
    addFolders: (state, action) => {
      const folders = action.payload
      state.entities = { ...state.entities, ...folders.entities }
      state.ids = folders.ids
    },
    removeAllFolders: (state) => {
      state.entities = {}
      state.ids = []
    },
  },
})

export const selectFolderEntities = (state: RootState) => state.folders.entities
export const selectFolderIds = (state: RootState) => state.folders.ids
export const selectFolderById = createSelector(
  [selectFolderEntities, (state, folderId) => folderId],
  (entities, folderId) => entities[folderId]
)
export const selectFolderIdTitles = createSelector(selectFolderEntities, (entities) => {
  return Object.values(entities).map((folder) => {
    return { id: folder.id, title: folder.title }
  })
})

export const { addFolder, updateFolder, removeFolder, toggleEdit, toggleExpand, removeAllFolders, addFolders } =
  folderSlice.actions

export default folderSlice.reducer
