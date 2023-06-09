import { AxiosResponse } from "axios"
import { Configuration, OpenAIApi } from "openai"
import { ChatCompletionRequestMessageRoleEnum, CreateChatCompletionResponse } from "openai"
import { Message } from "../redux/messageSlice"

type BotResponse = AxiosResponse<CreateChatCompletionResponse> | null

let openai: OpenAIApi

/**
 * Initializes the OpenAI API client with the provided API key.
 *
 * @param apiKey The API key used to authenticate with the OpenAI API.
 */
export const initializeOpenAIAPI = (apiKey: string) => {
  const configuration = new Configuration({
    apiKey: apiKey,
  })
  openai = new OpenAIApi(configuration)
}

/**
 * Retrieves a list of available models from the OpenAI API.
 *
 * @returns A promise that resolves with a list of models, or rejects with an error if the API key is invalid.
 */
export const listModels = async () => {
  try {
    return await openai.listModels()
  } catch (error) {
    return Promise.reject(new Error("Invalid API Key"))
  }
}

/**
 * Get a response from OpenAI GPT model given the user message and chat history.
 *
 * @param {string} message - The user's message to the bot.
 * @param {Message[]} messageHistory - An array of previous messages in the chat history.
 * @returns {Promise<BotResponse>} A promise that resolves to the bot's response.
 */
export const getBotResponse = async (message: string, messageHistory: Message[]) => {
  const botResponsePromise = openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Be helpful" },
      ...messageHistory.map(formatMessageForAPI),
      { role: "user", content: message },
    ],
  })

  try {
    if (process.env.APP_BUILD === "development") {
      return mockResponse
    }
    return await botResponsePromise
  } catch (error) {
    console.error(error)
    return Promise.reject(new Error("Bot encountered an error: "))
  }
}

/**
 * Extract the bot message from the response object returned by OpenAI GPT model.
 *
 * @param {BotResponse} response - The response object returned by OpenAI GPT model.
 * @returns {Message} The bot's message extracted from the response object.
 */
export const extractBotMessage = (response: BotResponse) => {
  const botMessage = response?.data?.choices?.[0]?.message?.content
  return {
    isBot: true,
    text: botMessage ?? "ERROR: Failed to receive a valid response from OpenAI.",
    created: response?.data.created,
    model: response?.data.model,
    usage: response?.data.usage,
  }
}

export const getPricing = (model: string, tokens: number): number => {
  if (model.includes("gpt-3.5-turbo")) {
    return (0.002 * tokens) / 1000.0
  }
  return 0.0
}

const formatMessageForAPI = (message: Message): { role: ChatCompletionRequestMessageRoleEnum; content: string } => {
  return {
    role: message.isBot ? "assistant" : "user",
    content: message.text,
  }
}

const mockResponse: BotResponse = {
  data: {
    id: "mock-id",
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model: "gpt-3.5-turbo",
    usage: {
      prompt_tokens: 1,
      completion_tokens: 2,
      total_tokens: 3,
    },
    choices: [
      {
        message: {
          role: "assistant",
          content: "This is a mock response from the bot.",
        },
        finish_reason: "stop",
        index: 0,
      },
    ],
  },
  status: 200,
  statusText: "OK",
  headers: {},
  config: {},
}
