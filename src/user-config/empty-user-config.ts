import { UserConfig } from './user-config.model.js';

export const emptyUserConfig: UserConfig = {
   editor: {
      type: 'nano',
   },
   aws: {
      accessKeyId: '',
      secretAccessKey: '',
      region: '',
      config: {
         id: 'Joanna',
         textType: 'text',
         outputFormat: 'mp3',
      },
   },
   chatGPT: {
      key: '',
   },
   languageCode: 'en-US',
   wakeWords: ['mia', 'ey', 'wake up', 'help me'],
   fileSearchDirs: [
      {
         words: ['home', 'hem'],
         dirPath: '/Users/jim/Desktop',
      },
   ],
};
