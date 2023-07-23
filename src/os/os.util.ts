import os from 'os';

export const getCurrentOS = () => {
   return os.platform();
};
