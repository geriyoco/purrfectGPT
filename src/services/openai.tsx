import { Configuration, OpenAIApi } from 'openai';
import secrets from '../../secrets.json';

const configuration = new Configuration({
    organization: secrets.organization,
    apiKey: secrets.apiKey,
});
const openai = new OpenAIApi(configuration);

type Message = {text: string, isBot: boolean};

export const getBotResponse = async (message: string): Promise<Message> => {
  const botResponsePromise = openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": message},
    ],
  });

  const errorMessage = "ERROR: Failed to receive a valid response from OpenAI."

  try {
    const botResponse = await botResponsePromise;
    const botMessage = botResponse.data.choices[0].message;
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
