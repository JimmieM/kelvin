import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let _rootDirectory = __dirname.split(path.sep) as any; // this gives an array of directories
let distIndex = _rootDirectory.indexOf('dist'); // find the index of 'dist'

if (distIndex > -1) {
   _rootDirectory = _rootDirectory.slice(0, distIndex); // Remove everything after 'dist' including 'dist'
}

export const rootDirectory = _rootDirectory.join(path.sep) as string; // Join the directories back into a path
