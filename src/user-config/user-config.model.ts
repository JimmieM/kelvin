export const EditorType = {
   VIM: 'vim',
   nano: 'nano',
};

type AWSAccessConfig = {
   accessKeyId: string;
   secretAccessKey: string;
   region: string;

   config?: {
      id: string;
      languageCode: string;
      textType: string;
      outputFormat: string;
   };
};

export interface EditorSettings {
   type: keyof typeof EditorType;
}

export interface UserConfig {
   editor: EditorSettings;
   aws: AWSAccessConfig;
   chatGPT: {
      key: string;
   };
}
