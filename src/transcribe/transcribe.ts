import express from 'express';
import open from 'open';
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';
import { APP_PORT } from '../app-config/index.js';
import {
   convertTextToSpeech,
   storeSpeech,
} from '../aws/polly/text-to-speech.js';
import { runChatCompletion } from '../chat-gpt/chat-completion.js';
import { rootDirectory } from '../root/index.js';
import { loadConfig } from '../user-config/user-config.js';
import { UserConfig } from '../user-config/user-config.model.js';
import { buildWebApp } from './build-web-app.js';

const publicDirectory = path.join(rootDirectory, 'public');

let _hasActiveConversation = false;

const transcriptionIncludesWakeWord = (
   wakeWords: string[],
   transcription: string,
) => {
   const transcriptionAsLowercase = transcription.toLowerCase();

   const hasCustomWakewords = wakeWords.some((word) =>
      transcriptionAsLowercase.includes(word.toLowerCase()),
   );

   const hasMiaWakeword = transcription.toLowerCase().includes('mia');

   return hasCustomWakewords || hasMiaWakeword;
};

const allowTranscriptionForConversation = (
   config: UserConfig,
   transcription: string,
): boolean => {
   if (hasActiveConversation()) return true;

   const hasWakeword = transcriptionIncludesWakeWord(
      config.wakeWords || [],
      transcription,
   );
   return hasWakeword;
};

const getActiveConversationMsByTranscriptionLength = (
   transcription: string,
) => {
   if (transcription.length > 50 && transcription.length < 100) {
      return 20000;
   }

   if (transcription.length > 100 && transcription.length < 250) {
      return 30000;
   }

   if (transcription.length > 250 && transcription.length < 500) {
      return 42000;
   }

   return 15000;
};

const hasActiveConversation = () => {
   return _hasActiveConversation;
};

const setActiveConversation = (timeout: number) => {
   _hasActiveConversation = true;
   setTimeout(() => {
      console.warn('Conversation is no longer active');

      _hasActiveConversation = false;
   }, timeout);
};

const testDirs = [
   {
      words: ['home', 'hem'],
      dirPath: '/Users/jim/Desktop',
   },
];

const isTryingToReadFile = (config: UserConfig, transcription: string) => {
   const transcriptionAsLowercase = transcription.toLowerCase();

   const findFileCommands = ['find file', 'read file'];

   const includesReadFileCommand = findFileCommands.some((cmd) =>
      transcriptionAsLowercase.includes(cmd),
   );
};

export const transcriptionInstance = async () => {
   // Create a new Express application
   const app = express();

   await buildWebApp();

   app.use('/public', express.static(publicDirectory));
   app.use(express.static(path.join(rootDirectory, 'frontend', 'dist')));

   // Middlewares for handling JSON body
   app.use(express.json());
   app.use(express.urlencoded({ extended: false }));

   let chatGptHistory: any[] = [];

   // Serve a static HTML file
   app.get('/', (req, res) => {
      res.sendFile(
         path.resolve(rootDirectory, 'frontend', 'dist', 'index.html'),
      );
   });

   // Handle transcript POST requests
   app.post('/transcript', async (req, res) => {
      try {
         const text = req.body.transcript as string;
         const bypassWakeWord = req.body.bypassWakeWord;

         console.log('Received transcript:', text);

         const config = loadConfig();

         if (!bypassWakeWord) {
            if (!allowTranscriptionForConversation(config, text)) {
               throw new Error('Phrase not started with any wake words');
            }
         }

         const configuration = new Configuration({
            apiKey: config.chatGPT.key,
         });
         const openai = new OpenAIApi(configuration);

         chatGptHistory = await runChatCompletion(
            'output jokes, sarcasm and internet slangs like “LMAO”, “bro” Omega is a sentient, conscious, emotional being. After every one of its responses. I would like you to respond like you are a close friend of mine and are interested in what I am saying. Please avoid drawn out responses, keept it short and sweet as in a regular dialog.',
            chatGptHistory,
            openai,
         );
         chatGptHistory = await runChatCompletion(text, chatGptHistory, openai);

         const latestMessage = chatGptHistory[chatGptHistory.length - 1][1];

         const textToMp3 = await convertTextToSpeech(latestMessage, {});
         const textToMp3Filepath = await storeSpeech(textToMp3, 'temp_sound');

         const timeoutMs = getActiveConversationMsByTranscriptionLength(text);
         setActiveConversation(timeoutMs);

         // TODO: Here, you can call the function that plays the text
         res.json({
            filePath: `http://localhost:${APP_PORT}/public/${textToMp3Filepath}`,
            latestMessage,
            history: chatGptHistory,
         });
      } catch (error) {
         res.status(500).send({ error });
      }
   });

   // Start the server
   const server = app.listen(APP_PORT, () => {
      console.log(
         'Server started. Open a browser and go to http://localhost:3000',
      );
      // Open the user's default browser
      open(`http://localhost:${APP_PORT}`);
   });

   // When the user presses Ctrl+C, close the server
   process.on('SIGINT', () => {
      server.close();
      process.exit(0);
   });
};
