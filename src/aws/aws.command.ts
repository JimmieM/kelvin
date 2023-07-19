import { Command } from 'commander';
import {
   loadConfig,
   saveConfig,
   setConfig,
} from '../user-config/user-config.js';
import { UserConfig } from '../user-config/user-config.model.js';
import { getCurrentOS } from '../os/os.util.js';
import { getTildeCommandForOS } from '../bash/bash.util.js';
import { createAccessKeys } from './iam/create-iam-access-key.js';
import { createIAMUser } from './iam/create-iam-user.js';
import {
   parseLocalAwsProfiles,
   getAwsCredentialsByProfile,
} from './iam/get-local-credential-config.js';
import { listProfiles } from './iam/list-iam.js';

export const awsCommand = new Command('aws');

export const iamCommand = awsCommand.command('iam');
export const credentialsCommand = awsCommand.command('credentials');
export const localAwsCredentials = awsCommand.command('profile');

export const setAwsCredentialsConfig = (
   config: UserConfig,
   profile: {
      secretAccessKey: string;
      accessKeyId: string;
      region?: string;
   },
): UserConfig => {
   return {
      ...config,
      aws: {
         secretAccessKey: profile.secretAccessKey,
         accessKeyId: profile.accessKeyId,
         region: profile.region || config.aws.region,
      },
   };
};

iamCommand
   .command('add <userName>')
   .description('create an AWS IAM profile')
   .action(async (userName) => {
      try {
         const createdUserName = await createIAMUser(userName);

         console.log('IAM user created:', createdUserName);
      } catch (error) {
         console.error('Error creating IAM user:', error);
      }
   });

iamCommand
   .command('ls')
   .description('list your IAM profiles')
   .action(async () => {
      try {
         const profiles = await listProfiles();

         console.table(profiles);
      } catch (error) {
         console.error('Error creating IAM user:', error);
      }
   });

iamCommand
   .command('key-gen <userName> [options]')
   .option('--use', 'use new credetial')
   .description('create AWS IAM access keys profile')
   .action(async (userName, options) => {
      try {
         const createdKey = await createAccessKeys(userName);

         console.log('Access key created:', createdKey.UserName);

         if (options.use) {
            const newConf = setAwsCredentialsConfig(loadConfig(), {
               secretAccessKey: createdKey.SecretAccessKey,
               accessKeyId: createdKey.AccessKeyId,
            });

            saveConfig(newConf);

            console.log(
               "You're now using your new access key in Ellah.",
               createdKey.UserName,
            );
         }
      } catch (error) {
         console.error('Error creating IAM user:', error);
      }
   });

awsCommand
   .command('set <key> <value>')
   .description('set an AWS config key')
   .action((key, value) => {
      try {
         const config = loadConfig();

         const manipulatedConfig = setConfig(config, key, value, [
            ['region', ['aws', 'region']],
            ['accessKeyId', ['aws', 'accessKeyId']],
            ['secretAccessKey', ['aws', 'secretAccessKey']],
         ]);

         saveConfig(manipulatedConfig);
         console.warn(`Config key ${key} is now ${value}`);
      } catch (error) {
         console.warn('Failed to set AWS config key');
         console.warn(error);
      }
   });

localAwsCredentials
   .command('ls')
   .description(
      `list stored config in ${getTildeCommandForOS(
         getCurrentOS(),
      )}/.aws/credentials`,
   )
   .action(() => {
      const profiles = parseLocalAwsProfiles();
      console.table(profiles);
   });

localAwsCredentials
   .command('get <profileName>')
   .description('view credentials of profile name')
   .action((profileName) => {
      const profile = getAwsCredentialsByProfile(profileName);
      console.table(profile);
   });

localAwsCredentials
   .command('use <profileName>')
   .description('use credentials of profile name in your Ellah configuration')
   .action((profileName) => {
      const profile = getAwsCredentialsByProfile(profileName);

      if (!profile.accessKeyId || !profile.secretAccessKey) {
         console.warn(
            'accessKeyId or secreyAccessKey is empty. Cannot procceed.',
         );
         return;
      }

      try {
         const config = loadConfig();

         const modifiedConfig = setAwsCredentialsConfig(config, {
            accessKeyId: profile.accessKeyId!,
            secretAccessKey: profile.secretAccessKey!,
         });

         saveConfig(modifiedConfig);
         console.log(`You're now using ${profileName} keys with Ellah`);
      } catch (error) {
         console.warn(
            `Failed to use configuration from ${getTildeCommandForOS(
               getCurrentOS(),
            )}/.aws/credentials:`,
            profileName,
         );
      }
   });
