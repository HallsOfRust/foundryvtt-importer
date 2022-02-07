import { cleanName } from '../formatters';
import { Config } from '../settings';

export interface Note {
  value: string;
  tag: string;
  parent?: JournalNode;
}

export interface JournalNode {
  value: string;
  tag: string;
  notes: Array<Note>;
  children: Array<JournalNode>;
  parent?: JournalNode;
  sortValue?: number;
}

export function getRootName(jsonfile: string) {
  // get file name from full path
  const fileName = jsonfile.split('/').pop() || jsonfile;
  // remove extension
  const name = fileName.split('.').shift() || fileName;
  // convert _ to space
  const rootName = name.replace(/_/g, ' ');
  // Capitalize first letter
  return rootName.charAt(0).toUpperCase() + rootName.slice(1);
}

const formatList = (note: string) => {
  let prepend = '';
  if (note.includes('1. ') && note.includes('2. ')) {
    const splitNote = note.split(/[0-9]+\./);
    if (note[0] !== '1') {
      prepend = splitNote[0];
      splitNote.shift();
    }
    const asList = splitNote.map((listItem: string) => {
      return `<li>${listItem.trim()}</li>`;
    });
    return `${prepend}<ol>${asList.join('')}</ol>`;
  }

  if (note.includes('•')) {
    const splitNote = note.split(/•/);
    if (note[0] !== '•') {
      prepend = splitNote[0];
      splitNote.shift();
    }
    const asList = splitNote.map((listItem: string) => {
      return `<li>${listItem.trim()}</li>`;
    });
    return `<ul>${asList.join('')}</ul>`;
  }
  return `${note}`;
};

export function notesToHTMLNote(notes: Note[]): string {
  const values = notes.map(normalizeHeaders);
  const finalNotes = values.map(noteMaps);
  return finalNotes.reduce((note: string, htmlNote: string) => {
    return `${note}${htmlNote}`;
  }, ``);
}

function normalizeHeaders(note: Note) {
  if (note.tag.includes('h')) {
    if (Number(note.tag.replace('h', '')) > 10) {
      note.tag = 'p';
    }
  }
  const tag = note.tag.includes('h') ? 'h2' : note.tag;
  const value = note.value.trim();
  return `<${tag}>${value}</${tag}>`;
}

const noteMaps = (note: string) => {
  return formatList(note);
};

function getSortValue(title: string) {
  // if first two characters are a number, extract the number
  const firstTwo = title.substring(0, 2);
  if (firstTwo.match(/^\d+$/)) {
    return parseInt(firstTwo, 10);
  }
  // if the first character is a number, extract the number
  const first = title.substring(0, 1);
  if (first.match(/^\d+$/)) {
    return parseInt(first, 10);
  }
  // otherwise, return the ascii value of the first characters
  return first.charCodeAt(0);
}

async function createFoldersRecursive(
  node: JournalNode,
  rootFolder: StoredDocument<Folder> | undefined,
  currentFolder: StoredDocument<Folder> | undefined,
  currentDepth = 1,
  settings: Config,
) {
  let folder: StoredDocument<Folder> | undefined = currentFolder ?? rootFolder;

  if (node.children.length > 0 && currentDepth < settings.folderDepth) {
    const current_id = currentFolder?.data?._id ?? rootFolder?.data._id ?? undefined;
    folder =
      (await Folder.create({
        name: cleanName(node.value),
        type: 'JournalEntry',
        parent: current_id,
        sorting: 'm',
      })) ?? rootFolder;
    currentDepth++;
  }
  let htmlNote = notesToHTMLNote(node.notes);
  if (htmlNote.length > 0 && htmlNote !== '') {
    htmlNote = `<div>${htmlNote}</div>`;
    await JournalEntry.create({
      name: `${cleanName(node.value)}`,
      content: htmlNote,
      collectionName: node.value,
      folder: folder?.data?._id,
      sort: node.sortValue ?? 0,
    });
  }

  if (node.children) {
    const children = node.children.map((child) => {
      return { ...child, sortValue: child?.sortValue ?? getSortValue(child.value) };
    });
    for (const child of children) {
      await createFoldersRecursive(child, rootFolder, folder, currentDepth, settings);
    }
  }
}

export async function journalFromJson(data: JournalNode[], name?: string) {
  let folder: StoredDocument<Folder> | undefined = undefined;
  if (name) {
    folder = await Folder.create({
      name: cleanName(name),
      type: 'JournalEntry',
      sorting: 'm',
    });
  }
  const settings = Config._load();
  console.log(`Building journals with a depth of ${settings.folderDepth}`);
  data.forEach(async (section: JournalNode) => {
    await createFoldersRecursive(section, folder, undefined, 1, settings);
  });
  console.log(`Finished generating ${name} Journals...`);
}
