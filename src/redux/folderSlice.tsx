import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { v4 as uuidv4 } from 'uuid';

interface Folder {
  id: string;
  title: string;
  edit: boolean;
  expand: boolean;
  chatIds: string[];
}


const folderSlice = createSlice({
  name: 'folders',
  initialState: {
    entities: [] as Folder[],
  },
  reducers: {
    addFolder: (state) => {
      const chatId = uuidv4()
      state.entities.push({ id: chatId, title: `New Folder`, chatIds: [], edit: false, expand: false })
    },
    updateFolder: (state, action) => {
      const { id, title, chatIds } = action.payload
      return {
        ...state,
        entities: state.entities.map((folder) => (folder.id === id ? { ...folder, title: title ? title : folder.title, chatIds: chatIds, edit: false } : folder))
      }
    },
    removeFolder: (state, action) => {
      return {
        ...state,
        entities: state.entities.filter((folder) => folder.id !== action.payload),
      }
    },
    toggleEdit: (state, action) => {
      return {
        ...state,
        entities: state.entities.map((folder) => (folder.id === action.payload ? { ...folder, edit: !folder.edit } : { ...folder, edit: false }))
      }
    },
    toggleExpand: (state, action) => {
      return {
        ...state,
        entities: state.entities.map((folder) => (folder.id === action.payload ? { ...folder, expand: !folder.expand } : { ...folder, expand: false }))
      }
    },
    updateScreensInFolders: (state, action) => {
      const { screenId, folderId } = action.payload
      return {
        ...state,
        entities: state.entities.map((folder) =>
          folder.id === folderId
            ? { ...folder, chatIds: !folder.chatIds.includes(screenId) ? [...folder.chatIds, screenId] : folder.chatIds, expand: true }
            : { ...folder, chatIds: folder.chatIds.filter((id) => id !== screenId) }
        )
      }
    },
    removeScreensInFolder: (state, action) => {
      const { screenId, folderId } = action.payload
      return {
        ...state,
        entities: state.entities.map((folder) => (folder.id === folderId ? { ...folder, chatIds: folder.chatIds.filter((id) => id !== screenId) } : folder))
      }
    },
    removeAllFolders: (state) => {
      return {
        ...state,
        entities: []
      }
    },
    addFolders: (state, action) => {
      const folders = action.payload
      return {
        ...state,
        ...folders
      }
    }
  },
});

export const selectAllFolders = (state: RootState) => state.folders.entities

// Export the slice's reducer and actions
export const {
  addFolder,
  updateFolder,
  removeFolder,
  toggleEdit,
  toggleExpand,
  updateScreensInFolders,
  removeScreensInFolder,
  removeAllFolders,
  addFolders
} = folderSlice.actions;
export default folderSlice.reducer;