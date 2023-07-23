import chalk from 'chalk';
import { Command } from 'commander';
import { loadConfig, saveConfig } from './user-config.js';
import { EditorSettings } from './user-config.model.js';

export const configCommand = new Command('config');

export const configTable = (config: EditorSettings | undefined): any[] => {
   return Object.entries(config || {}).reduce((acc, [key, value]) => {
      if (typeof value === 'object' && value !== null) {
         return acc.concat(configTable(value));
      } else {
         return acc.concat({ key, value });
      }
   }, [] as any[]);
};
configCommand.command('ls').action(async () => {
   const config = loadConfig();

   const editorTable = configTable(config.editor);

   console.log(chalk.blueBright.bgWhite.bold('Config'));
   console.table(editorTable);
});

configCommand
   .command('set <key> <value>')
   .description('set a config key')
   .action((key, value) => {
      const config = loadConfig();

      switch (key) {
         case 'langcode':
            config.languageCode = value;
            break;
         case 'editor':
            config.editor.type = value;
            break;
      }

      saveConfig(config);
   });
