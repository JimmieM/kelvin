import { exec } from 'child_process';
import path from 'path';
import { rootDirectory } from '../root/index.js';
import { loadConfig } from '../user-config/user-config.js';

export const buildWebApp = () => {
   return new Promise<void>((resolve, reject) => {
      exec(
         `npm i && REACT_APP_LANG_CODE=${
            loadConfig().languageCode
         } npm run build`,
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
