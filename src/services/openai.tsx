import { Configuration, OpenAIApi } from 'openai';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

const configuration = new Configuration({
    organization: process.env.ORG_ID,
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

type Message = {text: string, isBot: boolean};

const formatMessageForAPI = (message: Message): {role: ChatCompletionRequestMessageRoleEnum, content: string} => {
  return {
    role: message.isBot ? "assistant" : "user",
    content: message.text,
  };
};

export const getBotResponse = async (message: string, messageHistory: Message[]): Promise<Message> => {
  const botResponsePromise = openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {"role": "system", "content": "Be helpful"},
      ...messageHistory.map(formatMessageForAPI),
      {"role": "user", "content": message},
    ],
  });

  const errorMessage = "ERROR: Failed to receive a valid response from OpenAI."
  try {
    if (process.env.DEBUG === "true") {
      return {
        text: "DEBUG=True: Automated message from bot.",
        isBot: true,
      }
    }
    
    const botResponse = await botResponsePromise;
    const botMessage = botResponse.data.choices[0].message; // bot always chooses the first response
    return {
      text: botMessage?.content ? botMessage.content : errorMessage,
      isBot: true,
    };
  } catch (error) {
    console.error(error);
    return {
      text: errorMessage,
      isBot: true,
    };
  }
};
