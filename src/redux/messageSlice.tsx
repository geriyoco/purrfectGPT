import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { v4 as uuidv4 } from 'uuid';
import { CreateCompletionResponseUsage } from 'openai';

// TODO: CreateCompletionResponseUsage is probably non-serializable

interface Message {
  id: string,
  screenId: string,
  text: string,
  isBot: boolean,
  created?: number,
  model?: string,
  usage?: CreateCompletionResponseUsage,
}

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    entities: [] as Message[],
  },
  reducers: {
    addMessage: (state, action) => {
      const { screenId, text, isBot, created, model, usage } = action.payload
      const message = {
        id: uuidv4(),
        screenId: screenId,
        text: text,
        isBot: isBot,
        created: created,
        model: model,
        usage: usage,
      }
      state.entities.push(message)
    },
    removeAllMessages: (state) => {
      return {
        ...state,
        entities: []
      }
    }
    // updateMessage: (state, action) => {
    //   const { id, title, folderId } = action.payload
    //   return {
    //     ...state,
    //     entities: state.entities.map((message) => (message.id === id ? { ...message, title: title ? title : message.title, folderId: folderId, edit: false } : message))
    //   }
    // },
    // removeMessage: (state, action) => {
    //   return {
    //     ...state,
    //     entities: state.entities.filter((message) => message.id !== action.payload),
    //     lastAddedmessageId: ''
    //   }
    // },
  },
});

export const selectAllMessages = (state: RootState, screenId: string) => state.messages.entities.filter((message) => message.screenId === screenId)

// Export the slice's reducer and actions
export const {
  addMessage,
  removeAllMessages
  // updateMessage, 
  // removeMessage 
} = messageSlice.actions;
export default messageSlice.reducer;