export const getTildeCommandForOS = (os: string) => {
   if (os === 'win32') return '%USERPROFILE%';
   return '~';
};
