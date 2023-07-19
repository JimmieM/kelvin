#!/usr/bin/env node
process.env.AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE = '1';

import AWS from 'aws-sdk';
import { loadConfig } from './user-config/user-config.js';
import { Command } from 'commander';
import { awsCommand } from './aws/aws.command.js';
import { transcribeCommand } from './transcribe/transcribe.command.js';

const config = loadConfig();

export const updateAwsConfig = (region?: string) => {
   AWS.config.update({
      ...config.aws,
      region: region ?? config.aws.region,
   });
};

updateAwsConfig();

const program = new Command();

program.addCommand(awsCommand);
program.addCommand(transcribeCommand);

async function main() {
   await program.parseAsync(process.argv);
}

console.log(); // log a new line so there is a nice space
await main();
