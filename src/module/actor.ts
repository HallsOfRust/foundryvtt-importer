import { Tesseract } from 'tesseract.ts';
import { actorToFifth, featureCollectionToItems } from './actors.convert';
import { textToActor } from './actors.process';
import { UserData } from './importForm';

async function txtRoute(stringData: string) {
  const actor = textToActor(stringData);
  const { features } = actor;
  const preparedItems = featureCollectionToItems(features, { abilities: actor.stats });
  console.log(`Prepared items: ${JSON.stringify(preparedItems, null, 2)}`);
  const foundryActor = await Actor.create({
    name: actor.name,
    type: 'npc',
    data: actorToFifth(actor),
  });

  await Promise.all(
    preparedItems.map(async (item) => {
      console.log(`Creating item: ${item.name}`);
      return await Item.create(
        {
          ...item,
        },
        {
          parent: foundryActor,
        },
      );
    }),
  );
}

async function processOCR(file: Blob) {
  const { text } = await Tesseract.recognize(file);
  return text;
}

/* const worker = Tesseract.createWorker();
async function processOCR(file: Blob) {
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const {
    data: { text },
  } = await worker.recognize(file);
  await worker.terminate();
  return text;
} */

export async function processActorInput({ jsonfile, clipboardInput }: UserData) {
  if (clipboardInput) {
    console.log(`Clipboard input: ${clipboardInput}`);
    txtRoute(clipboardInput);
    return;
  }
  const response = await fetch(jsonfile);
  if (!response.ok) {
    console.log(`Error reading ${jsonfile}`);
    return;
  }
  const data = await response.blob();

  const ext = jsonfile.split('.').pop();
  switch (ext) {
    case 'png':
      console.log(`hanlding png`);
      const text = await processOCR(data);
      txtRoute(text);
      break;
    default:
      console.log(`Unknown file type ${ext}`);
  }
}
