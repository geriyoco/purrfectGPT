import { createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"
import { v4 as uuidv4 } from "uuid"
import { CreateCompletionResponseUsage } from "openai"

// TODO: CreateCompletionResponseUsage is probably non-serializable

export interface Message {
  id: string
  screenId: string
  text: string
  isBot: boolean
  isLoading: boolean
  isError: boolean
  created?: number
  model?: string
  usage?: CreateCompletionResponseUsage
}

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    entities: [] as Message[],
  },
  reducers: {
    addMessage: (state, action) => {
      const { id, screenId, text, isBot, created, model, usage, isLoading, isError } = action.payload
      const message = {
        id: id,
        screenId: screenId,
        text: text,
        isBot: isBot,
        isLoading: isLoading,
        isError: isError,
        created: created,
        model: model,
        usage: usage,
      }
      state.entities.push(message)
    },
    addMessages: (state, action) => {
      const messages = action.payload
      return {
        ...state,
        ...messages,
      }
    },
    editMessage: (state, action) => {
      const { id, screenId, text, isBot, isLoading, isError, created, model, usage } = action.payload
      return {
        ...state,
        entities: state.entities.map((message) =>
          message.id === id
            ? {
                id: id,
                screenId: screenId,
                text: !isError ? text : "ERROR: Bot has encountered an error, please try again",
                isBot: isBot,
                isLoading: isLoading,
                isError: isError,
                created: created,
                model: model,
                usage: usage,
              }
            : message
        ),
      }
    },
    updateMessage: (state, action) => {
      const { messageId, text } = action.payload
      return {
        ...state,
        entities: state.entities.map((message) => (message.id === messageId ? { ...message, text: text } : message)),
      }
    },
    removeMessage: (state, action) => {
      const { messageId } = action.payload
      return {
        ...state,
        entities: state.entities.filter((message) => message.id !== messageId),
      }
    },
    removeAllMessages: (state) => {
      return {
        ...state,
        entities: [],
      }
    },
  },
})

const selectMessages = (state: RootState) => state.messages.entities
export const selectMessagesByScreenId = createSelector(
  [selectMessages, (state:RootState, screenId: string) => screenId],
  (messages: Message[], screenId: string) => messages.filter((message) => message.screenId === screenId)
)

// Export the slice's reducer and actions
export const { addMessage, addMessages, updateMessage, removeMessage, removeAllMessages, editMessage } =
  messageSlice.actions
export default messageSlice.reducer
