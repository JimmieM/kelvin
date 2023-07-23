import { OpenAIApi } from 'openai';

export const runChatCompletion = async (
   text: string,
   _history: any[],
   openaiInstance: OpenAIApi,
): Promise<any[]> => {
   const history = [..._history];

   const messages = [];
   for (const [input_text, completion_text] of history) {
      messages.push({ role: 'user', content: input_text });
      messages.push({ role: 'assistant', content: completion_text });
   }

   messages.push({ role: 'user', content: text });

   try {
      const completion = await openaiInstance.createChatCompletion({
         model: 'gpt-3.5-turbo',
         messages: messages as any,
      });

      const completion_text = completion.data.choices[0].message?.content;

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
