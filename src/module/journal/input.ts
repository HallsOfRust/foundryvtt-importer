import { UserData } from '../importForm';
import { getRootName, journalFromJson, JournalNode } from './parse.json';
import { parseToJournal } from './process';

function forEachJournal(root: JournalNode, callback: (journal: JournalNode) => void) {
  callback(root);
  root.children.forEach((child) => forEachJournal(child, callback));
}

function removeCircular(rootJournal: JournalNode) {
  forEachJournal(rootJournal, (journal) => {
    journal.notes = journal.notes.map((note) => {
      note.parent = undefined;
      return note;
    });
    journal.parent = undefined;
  });
}

async function txtRoute(input: string) {
  const rootJournal = parseToJournal(input);
  removeCircular(rootJournal);
  console.log(`Journal: ${JSON.stringify(rootJournal, null, 2)}`);
  journalFromJson(rootJournal.value, [rootJournal]);
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
