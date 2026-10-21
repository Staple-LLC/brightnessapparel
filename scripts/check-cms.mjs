import {readFile} from 'node:fs/promises';
import {validateContent} from './content-validation.mjs';
const read=async path=>JSON.parse(await readFile(new URL(path,import.meta.url),'utf8'));
validateContent(await read('../src/cms/website-content.json'),await read('../src/cms/default-content.json'));
console.log('Validated Git-tracked website content. No CMS API or build credentials required.');
