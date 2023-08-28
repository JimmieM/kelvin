import { exec } from 'child_process';
import path from 'path';
import { rootDirectory } from '../root/index.js';
import { loadConfig } from '../user-config/user-config.js';

export const buildWebApp = () => {
   const langCode = loadConfig().languageCode;
   const command = `npm i && cross-env REACT_APP_LANG_CODE=${langCode} npm run build`;

   return new Promise<void>((resolve, reject) => {
      exec(
         command,
         { cwd: path.join(rootDirectory, 'frontend') },
         (error, stdout, stderr) => {
            if (error) {
               console.error(`exec error: ${error}`);
               reject();
               return;
            }

            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);

            resolve();
         },
      );
   });
};
