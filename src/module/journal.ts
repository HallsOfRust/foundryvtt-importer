import { cleanName } from './formatters';
import { UserData } from './importForm';
import { Config } from './settings';

interface Note {
  value: string;
  tag: string;
}

interface JournalNode {
  value: string;
  tag: string;
  notes: Array<Note>;
  children: Array<JournalNode>;
  sortValue?: number;
}

function getRootName(jsonfile: string) {
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
      return `<li>${listItem}</li>`;
    });
    return `${prepend}<ol>${asList.join('')}</ol>`;
  }
  return `${note}`;
};

function normalizeHeaders(note: Note) {
  if (note.tag.includes('h')) {
    if (Number(note.tag.replace('h', '')) > 10) {
      note.tag = 'p';
    }
  }
  const tag = note.tag.includes('h') ? 'h2' : note.tag;
  return `<${tag}>${note.value}</${tag}>`;
}

const noteMaps = (note: string) => {
  return formatList(note);
};

const mergeParagraphs = (noteList: Note[], current: Note) => {
  if (current.tag !== 'p') {
    noteList.push(current);
    return noteList;
  }
  if (noteList.length === 0) {
    noteList.push(current);
    return noteList;
  }

  if (noteList[noteList.length - 1].tag === 'p') {
    noteList[noteList.length - 1].value += ` ${current.value}`;
  } else {
    noteList.push(current);
  }
  return noteList;
};

const collission_tracker: Record<string, number> = {};
async function createFoldersRecursive(
  node: JournalNode,
  rootFolder: StoredDocument<Folder>,
  currentFolder: StoredDocument<Folder> | undefined,
  currentDepth = 1,
  settings: Config,
) {
  let folder: StoredDocument<Folder> = currentFolder ?? rootFolder;
  // if node.value in collission_tracker, then we have a collision
  collission_tracker[node.value] = collission_tracker[node.value] ?? 0;
  collission_tracker[node.value]++;
  const name = `${node.value}`;

  if (node.children.length > 0 && currentDepth < settings.folderDepth) {
    const current_id = currentFolder?.data?._id ?? rootFolder.data._id;
    folder =
      (await Folder.create({
        name: cleanName(name),
        type: 'JournalEntry',
        parent: current_id,
        sorting: 'm',
      })) ?? rootFolder;
    currentDepth++;
  }
  const notes = node.notes.reverse();
  const reduced = notes.reduce(mergeParagraphs, []);
  const values = reduced.map(normalizeHeaders);
  const finalNotes = values.map(noteMaps);
  let htmlNote = finalNotes.reduce((note: string, htmlNote: string) => {
    return `${htmlNote}${note}`;
  }, ``);
  htmlNote = `<div>${htmlNote}</div>`;
  await JournalEntry.create({
    name: `${cleanName(name)}`,
    content: htmlNote,
    collectionName: node.value,
    folder: folder?.data?._id,
    sort: node.sortValue ?? 0,
  });

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

  if (node.children) {
    const children = node.children.map((child) => {
      return { ...child, sortValue: getSortValue(child.value) };
    });
    for (const child of children) {
      await createFoldersRecursive(child, rootFolder, folder, currentDepth, settings);
    }
  }
}

async function journalFromJson(name: string, data: JournalNode[]) {
  const folder = await Folder.create({
    name: cleanName(name),
    type: 'JournalEntry',
    sorting: 'm',
  });
  if (!folder) {
    console.log(`Error creating folder ${name}`);
    return;
  } else {
    const settings = Config._load();
    console.log(`Building journals with a depth of ${settings.folderDepth}`);
    data.forEach(async (section: JournalNode) => {
      await createFoldersRecursive(section, folder, undefined, 1, settings);
    });
    console.log(`Finished generating ${name} Journals...`);
  }
}

export async function processInputJSON({ jsonfile }: UserData) {
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
