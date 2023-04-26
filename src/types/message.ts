import { CreateCompletionResponseUsage } from "openai";

export type Message = {
  isBot: boolean;
  text: string;
  created?: number;
  model?: string;
  usage?: CreateCompletionResponseUsage;
};
