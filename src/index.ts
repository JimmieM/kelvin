#!/usr/bin/env node
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1';

import AWS from 'aws-sdk';
import { loadConfig } from './user-config/user-config.js';
import { Command } from 'commander';
import { awsCommand } from './aws/aws.command.js';
import { transcriptionInstance } from './transcribe/transcribe.js';
import { configCommand } from './user-config/user-config.command.js';
import path from 'path';
import { rootDirectory } from './root/index.js';
import { mkDir } from './fs-util/index.js';

async function main() {
   await program.parseAsync(process.argv);
}

const updateAwsConfig = (region?: string) => {
   const config = loadConfig();

   AWS.config.update({
      ...config.aws,
      region: region ?? config.aws.region,
   });
};

const setupOnBoot = async () => {
   updateAwsConfig();

   const publicDirectory = path.join(rootDirectory, 'public');
   await mkDir(publicDirectory);
};

/**
 * Begin setup
 */

await setupOnBoot();

const program = new Command();

program
   .description('Transcribes audio from the microphone')
   .action(transcriptionInstance);

program.addCommand(awsCommand);
program.addCommand(configCommand);

console.log(); // log a new line so there is a nice space
await main();
