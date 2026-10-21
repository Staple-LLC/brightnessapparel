import {parseSnapshot,getSection} from '../packages/cms-client/src/index.ts';
export function validateContent(value,defaults){
 const snapshot=parseSnapshot(value,'82a18e9e-ea66-4834-8b4d-a7625eb59bef');
 const strings=shape=>value=>!!value&&typeof value==='object'&&Object.keys(shape).every(key=>typeof value[key]==='string'&&value[key].length>0);
 const hero=getSection(snapshot,'/','hero',strings(defaults.hero));
 const contact=getSection(snapshot,'/contact','contact',strings(defaults.contact));
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)||!/^\d{8,15}$/.test(contact.whatsappNumber))throw Error('Invalid contact email or WhatsApp number');
 return {hero,contact};
}
