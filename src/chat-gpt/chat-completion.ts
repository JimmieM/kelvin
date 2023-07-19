import { Configuration, OpenAIApi } from 'openai';
import { loadConfig } from '../user-config/user-config.js';

const config = loadConfig();

export const runChatCompletion = async (
   text: string,
   history: any[],
): Promise<any[]> => {
   const configuration = new Configuration({
      apiKey: config.chatGPT.key,
   });
   const openai = new OpenAIApi(configuration);

   const messages = [];
   for (const [input_text, completion_text] of history) {
      messages.push({ role: 'user', content: input_text });
      messages.push({ role: 'assistant', content: completion_text });
   }

   messages.push({ role: 'user', content: text });

   try {
      const completion = await openai.createChatCompletion({
         model: 'gpt-3.5-turbo',
         messages: messages as any,
      });

      const completion_text = completion.data.choices[0].message?.content;
      console.log(completion_text);

      history.push([text, completion_text]);
   } catch (error: any) {
      if (error.response) {
         console.log(error.response?.status);
         console.log(error.response?.data);
      } else {
         console.log(error.message);
      }
   } finally {
      return history;
   }
};
