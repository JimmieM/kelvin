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
         languageCode: 'en-US',
         textType: 'text',
         outputFormat: 'mp3',
      },
   },
   chatGPT: {
      key: '',
   },
};
