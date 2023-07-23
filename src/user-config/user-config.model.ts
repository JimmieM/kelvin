export const EditorType = {
   VIM: 'vim',
   nano: 'nano',
};

export const LanguageCode = {
   US: 'en-US',
   UK: 'en-GB',
   AU: 'en-AU',
   CA: 'en-CA',
   FR: 'fr-FR',
   DE: 'de-DE',
   IT: 'it-IT',
   ES: 'es-ES',
   MX: 'es-MX',
   SE: 'sv-SE',
   JP: 'ja-JP',
   CN: 'zh-CN',
   TW: 'zh-TW',
   RU: 'ru-RU',
   BR: 'pt-BR',
   PT: 'pt-PT',
};

type AWSAccessConfig = {
   accessKeyId: string;
   secretAccessKey: string;
   region: string;

   config?: {
      id: string;
      textType: string;
      outputFormat: string;
   };
};

type ChatGPTConfig = {
   key: string;
};

export interface EditorSettings {
   type: keyof typeof EditorType;
}

export interface UserConfig {
   editor: EditorSettings;
   aws: AWSAccessConfig;
   chatGPT: ChatGPTConfig;
   languageCode: string;
   wakeWords: string[];
   fileSearchDirs?: { words: string[]; dirPath: string }[];
}
