import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

interface SearchResult {
   name: string;
   contents: string;
}

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

export async function searchDirectory(
   dir: string,
   searchText: string,
): Promise<SearchResult[]> {
   const dirents = await readdir(dir, { withFileTypes: true });

   const promises = dirents.map(async (dirent) => {
      const filePath = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
         return searchDirectory(filePath, searchText);
      } else if (dirent.isFile()) {
         const contents = await readFile(filePath, 'utf8');
         if (contents.includes(searchText)) {
            return [{ name: dirent.name, contents }];
         }
      }
      return [];
   });

   const nestedResults = await Promise.all(promises);
   return ([] as SearchResult[]).concat(...nestedResults);
}
