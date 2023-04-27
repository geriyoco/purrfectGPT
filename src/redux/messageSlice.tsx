import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { v4 as uuidv4 } from "uuid";
import { CreateCompletionResponseUsage } from "openai";

// TODO: CreateCompletionResponseUsage is probably non-serializable

export interface Message {
  id: string;
  screenId: string;
  text: string;
  isBot: boolean;
  created?: number;
  model?: string;
  usage?: CreateCompletionResponseUsage;
}

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    entities: [] as Message[],
  },
  reducers: {
    addMessage: (state, action) => {
      const { screenId, text, isBot, created, model, usage } = action.payload;
      const message = {
        id: uuidv4(),
        screenId: screenId,
        text: text,
        isBot: isBot,
        created: created,
        model: model,
        usage: usage,
      };
      state.entities.push(message);
    },
    addMessages: (state, action) => {
      const messages = action.payload;
      return {
        ...state,
        ...messages,
      };
    },
    updateMessage: (state, action) => {
      const { messageId, text } = action.payload;
      return {
        ...state,
        entities: state.entities.map((message) =>
          message.id === messageId ? { ...message, text: text } : message
        ),
      };
    },
    removeMessage: (state, action) => {
      const { messageId } = action.payload;
      return {
        ...state,
        entities: state.entities.filter((message) => message.id !== messageId),
      };
    },
    removeAllMessages: (state) => {
      return {
        ...state,
        entities: [],
      };
    },
  },
});

export const selectAllMessages = (state: RootState, screenId: string) =>
  state.messages.entities.filter((message) => message.screenId === screenId);

// Export the slice's reducer and actions
export const {
  addMessage,
  addMessages,
  updateMessage,
  removeMessage,
  removeAllMessages,
} = messageSlice.actions;
export default messageSlice.reducer;
