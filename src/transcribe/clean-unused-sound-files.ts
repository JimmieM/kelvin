import { Dirent, promises as fs } from 'fs';
import * as path from 'path';

export const isFileInUse = async (filepath: string): Promise<boolean> => {
   try {
      const newPath = `${filepath}.check`;
      await fs.rename(filepath, newPath);
      await fs.rename(newPath, filepath);
      return false;
   } catch (e) {
      return true;
   }
};

export const removeFilesInDirRecursive = async (dir: string) => {
   const fileAgeLimit = 30 * 60 * 1000; // 30 minutes in milliseconds

   try {
      const dirents: Dirent[] = await fs.readdir(dir, { withFileTypes: true });
      for (const dirent of dirents) {
         const filePath = path.join(dir, dirent.name);

         if (dirent.isFile()) {
            const stats = await fs.stat(filePath);
            const currentTime = Date.now();
            const fileAge = currentTime - stats.mtime.getTime();

            if (fileAge > fileAgeLimit && !(await isFileInUse(filePath))) {
               await fs.unlink(filePath);
               console.log('File deleted:', filePath);
            }
         } else if (dirent.isDirectory()) {
            await removeFilesInDirRecursive(filePath);
         }
      }
   } catch (err) {
      console.error('Error reading directory:', err);
   }
};
