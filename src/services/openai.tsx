import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    organization: process.env.ORG_ID,
    apiKey: process.env.API_KEY,
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
    if (process.env.DEBUG === 'true') {
      return {
        text: 'DEBUG=True: Automated message from bot.',
        isBot: true,
      }
    }
    
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
