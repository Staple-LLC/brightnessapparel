import snapshot from './website-content.json';
import defaults from './default-content.json';
import {parseSnapshot,getSection} from '../../packages/cms-client/src/index';

const published = parseSnapshot(snapshot, '82a18e9e-ea66-4834-8b4d-a7625eb59bef');
function validHero(value:unknown):value is typeof defaults.hero {
 return !!value&&typeof value==='object'&&Object.keys(defaults.hero).every(key=>typeof (value as Record<string,unknown>)[key]==='string');
}
function validContact(value:unknown):value is typeof defaults.contact {
 return !!value&&typeof value==='object'&&Object.keys(defaults.contact).every(key=>typeof (value as Record<string,unknown>)[key]==='string');
}
export const heroContent=getSection(published,'/','hero',validHero);
export const contactContent=getSection(published,'/contact','contact',validContact);
