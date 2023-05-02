import { createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store"
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
    entities: {} as Record<string, Message>,
    ids: [] as string[],
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
      state.entities[id] = message
      state.ids.push(id)
    },
    editMessage: (state, action) => {
      const { id, screenId, text, isBot, isLoading, isError, created, model, usage } = action.payload
      state.entities[id] = {
        id: id,
        screenId: screenId,
        text: !isError ? text : "ERROR: Bot has is currently experiencing issues, please try again",
        isBot: isBot,
        isLoading: isLoading,
        isError: isError,
        created: created,
        model: model,
        usage: usage,
      }
    },
    updateMessage: (state, action) => {
      const { messageId, text } = action.payload
      state.entities[messageId].text = text
    },
    removeMessage: (state, action) => {
      const { messageId } = action.payload
      delete state.entities[messageId]
      state.ids = state.ids.filter((id) => id !== messageId)
    },
    addMessages: (state, action) => {
      const messages = action.payload
      state.entities = { ...state.entities, ...messages.entities }
      state.ids = messages.ids
    },
    removeAllMessages: (state) => {
      state.entities = {}
      state.ids = []
    },
  },
})

const selectMessages = (state: RootState) => state.messages.entities
export const selectMessagesByScreenId = createSelector(
  [selectMessages, (state: RootState, screenId: string) => screenId],
  (messages: Record<string, Message>, screenId: string) => {
    return Object.values(messages).filter((message) => message.screenId === screenId)
  }
)

export const { addMessage, addMessages, updateMessage, removeMessage, removeAllMessages, editMessage } =
  messageSlice.actions
export default messageSlice.reducer
