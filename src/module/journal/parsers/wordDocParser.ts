import { JournalNode } from '../build';

export interface ImportFolder {
  name: string;
  entries?: Entry[];
  subfolders?: ImportFolder[];
}

export interface Entry {
  name: string;
  content: string;
}

export function isFolderLine(line: string, names?: string[]): boolean {
  if (!line) return false;
  if (names) {
    return names.find((name) => name === line) !== undefined;
  }
  const shortEnough = line.split(' ').length < 7;
  const hasBullet = line.includes('•');
  return shortEnough && !hasBullet;
}

export function guessDepth(input: string): number {
  let maxDepth = 0;
  let currentDepth = 0;
  const lines = input.split('\n');
  lines.forEach((line) => {
    if (isFolderLine(line)) {
      currentDepth++;
      if (currentDepth > maxDepth) {
        maxDepth = currentDepth;
      }
    } else {
      currentDepth = 0;
    }
  });
  return maxDepth < 3 ? maxDepth : 3;
}

export function buildStructure(input: string): ImportFolder {
  const first = input.split('\n');
  let lines = first.splice(1);
  lines = lines.filter((line) => line !== '');
  const rootFolder: ImportFolder = {
    name: first[0],
    entries: [],
    subfolders: [],
  };
  let currentFolder: ImportFolder = rootFolder;
  let entry: Entry | undefined;
  lines.forEach((line, index) => {
    let nextLine = lines[index + 1];
    if (index >= lines.length - 1) {
      nextLine = line;
    }
    if (isFolderLine(line) && isFolderLine(nextLine)) {
      const folderName = line;
      const newFolder = {
        name: folderName,
        entries: [],
        subfolders: [],
      };
      if (!currentFolder.subfolders) {
        currentFolder.subfolders = [];
      }
      currentFolder.subfolders.push(newFolder);
      currentFolder = newFolder;
    } else {
      if (nextLine === line) return;
      if (entry === undefined) {
        entry = {
          name: line,
          content: nextLine,
        };
        if (!currentFolder.entries) {
          currentFolder.entries = [];
        }
        currentFolder.entries.push(entry);
      } else {
        entry.content = entry.content + nextLine;
      }
      if (isFolderLine(nextLine)) {
        entry = undefined;
      }
    }
  });
  return rootFolder;
}

function buildHeader(currentDepth: number): string {
  return `h${currentDepth}`;
}

export function isNewStructure(lines: string[], index: number): boolean {
  const remaining = lines.slice(index);
  if (remaining.length < 2) {
    return false;
  }
  if (isFolderLine(remaining[0]) && isFolderLine(remaining[1])) {
    return true;
  }
  return false;
}

export function getNames(input: string): string[] {
  return [...input.split('\n\n').map((line) => line.split('\n')[0])];
}

export function isUpOne(lines: string[], index: number): boolean {
  const remaining = lines.slice(index);
  if (remaining.length < 2) {
    return false;
  }
  if (isFolderLine(remaining[0]) && isFolderLine(remaining[1])) {
    return false;
  }
  if (isFolderLine(remaining[0]) && !isFolderLine(remaining[1])) {
    return true;
  }
  return false;
}

function getNoteTag(line: string, currentDepth: number, maxDepth: number): string {
  if (line.includes('•')) return 'lu';
  if (currentDepth !== maxDepth && isFolderLine(line)) {
    return `h${currentDepth}`;
  }
  return 'p';
}

function newEntry(title: string, sortValue: number, prefix?: string): JournalNode {
  return {
    value: `${prefix}${title}`,
    tag: 'h2',
    notes: [],
    children: [],
    sortValue,
  };
}

function validTitle(lines: string[], index: number): boolean {
  if (lines.length <= index + 1) {
    return false;
  }
  const noTilesBorder =
    isFolderLine(lines[index]) && !isFolderLine(lines[index + 1]) && !isFolderLine(lines[index - 1]);
  const followedByBullet = lines[index + 1].includes('•');
  return noTilesBorder && !followedByBullet;
}

function parseName(input: string) {
  const lines = input.split('\n');
  return lines[0];
}

export function parseToJournalV2(input: string): JournalNode {
  const prefix = '';
  const name = parseName(input);
  const cleaned = input.replace(name, '').trim();
  const rootNode: JournalNode = {
    value: name,
    tag: 'h1',
    notes: [],
    children: [],
  };
  const chunks = cleaned.split('\n\n');
  const mainName = cleaned.split('\n')[0];
  let currentNode: JournalNode = {
    value: mainName,
    tag: 'h1',
    notes: [],
    children: [],
  };
  let sortValue = 1;
  chunks.forEach((chunk) => {
    const secondSplit = chunk.split('\n');
    const firstLine = secondSplit[0];
    secondSplit.forEach((line, index) => {
      const title = firstLine.split('\n')[0];
      if (title === line) {
        if (isFolderLine(title)) {
          if (currentNode) {
            if (title !== '' && title !== undefined) {
              rootNode.children.push(currentNode);
              currentNode = newEntry(title, sortValue, prefix);
              sortValue = sortValue + 1;
            }
          }
        } else {
          // this should be added to the current note
          currentNode.notes.push({
            value: line,
            tag: 'p',
          });
        }
      } else {
        if (validTitle(secondSplit, index)) {
          // find titles not cleanly separated by a double new line
          rootNode.children.push(currentNode);
          currentNode = newEntry(line, sortValue, prefix);
          sortValue = sortValue + 1;
        } else {
          currentNode.notes.push({
            value: line,
            tag: 'p',
          });
        }
      }
    });
  });
  return rootNode;
}
