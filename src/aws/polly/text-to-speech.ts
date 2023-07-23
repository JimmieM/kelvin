import pkg from 'aws-sdk';
import * as fs from 'fs';
import path from 'path';
import * as util from 'util';
import { v4 as uuidv4 } from 'uuid';
import { loadConfig } from '../../user-config/user-config.js';
import { UserConfig } from '../../user-config/user-config.model.js';
import { rootDirectory } from '../../root/index.js';

const { Polly } = pkg;

interface Options {
   id: string;
   languageCode: string;
   textType: string;
   outputFormat: string;
}

const defaultOptions = {
   id: 'Joanna',
   languageCode: 'en-US',
   textType: 'text',
   outputFormat: 'mp3',
};

const getPollyParams = (
   config: UserConfig,
   options: Partial<Options>,
   text: string,
) => {
   return {
      OutputFormat:
         config.aws.config?.outputFormat ||
         options.outputFormat ||
         defaultOptions.outputFormat,
      Text: text,
      VoiceId: config.aws.config?.id || options.id || defaultOptions.id,
      TextType:
         config.aws.config?.textType ||
         options.textType ||
         defaultOptions.textType,
      LanguageCode:
         config.languageCode ||
         options.languageCode ||
         defaultOptions.languageCode,
   };
};

export async function convertTextToSpeech(
   text: string,
   options: Partial<Options>,
): Promise<string> {
   const config = loadConfig();

   const polly = new Polly();
   const params = getPollyParams(config, options, text);

   const request = polly.synthesizeSpeech(params);
   const data = await request.promise();

   if (!(data.AudioStream instanceof Buffer)) {
      throw new Error('Failed to synthesize speech.');
   }

   const filename = `output-${uuidv4()}.mp3`;
   const publicDirectory = path.join(rootDirectory, 'public');
   const filepath = path.join(publicDirectory, filename);
   const writeFile = util.promisify(fs.writeFile);
   try {
      await writeFile(filepath, data.AudioStream);
   } catch (error) {
      console.warn(error);
   }
   console.log(`Audio content written to file: ${filename}`);
   return filename;
}
