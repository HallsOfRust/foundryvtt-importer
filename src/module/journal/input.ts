import { UserData } from '../importForm';
import { buildJournal } from './build';
import { getRootName, journalFromJson, JournalNode } from './parse.json';
import { buildStructure } from './process';

async function txtRoute(input: string) {
  const rootJournal = buildStructure(input);
  await buildJournal(rootJournal);
}

export async function processInputJSON({ jsonfile, clipboardInput }: UserData) {
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
  const data = await response.text();
  const json = JSON.parse(data) as JournalNode[];
  const name = getRootName(jsonfile);
  journalFromJson(name, json);
}
