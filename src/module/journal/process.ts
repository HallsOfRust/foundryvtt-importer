import { JournalNode } from './parse.json';

export interface ImportFolder {
  name: string;
  entries?: Entry[];
  subfolders?: ImportFolder[];
}

export interface Entry {
  name: string;
  content: string;
}

function isFolderLine(line: string): boolean {
  return line.split(' ').length < 7;
}

export function guessDepth(input: string): number {
  let maxDepth = 0;
  let currentDepth = 0;
  const lines = input.split('\n');
  lines.forEach((line) => {
    if (isFolderLine(line)) {
      currentDepth++;
    } else {
      if (currentDepth > maxDepth) {
        maxDepth = currentDepth;
      }
      currentDepth = 0;
    }
  });
  return maxDepth;
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

function getNoteTag(line: string) {
  if (line.includes('•')) return 'lu';
  return 'p';
}

export function parseToJournal(input: string): JournalNode {
  const first = input.split('\n');
  let lines = first.splice(1);
  lines = lines.filter((line) => line !== '');
  let currentDepth = 1;
  const rootFolder: JournalNode = {
    value: first[0],
    tag: buildHeader(currentDepth),
    notes: [],
    children: [],
  };
  let currentFolder: JournalNode = rootFolder;

  lines.forEach((line, index) => {
    currentDepth++;
    if (isFolderLine(line)) {
      const nextFolder = {
        value: line,
        tag: buildHeader(currentDepth + 1),
        notes: [],
        children: [],
        parent: currentFolder,
      };
      currentFolder.children.push(nextFolder);
      currentFolder = nextFolder;
    } else {
      const newNote = {
        value: line,
        tag: getNoteTag(line),
        parent: currentFolder,
      };
      currentFolder.notes.push(newNote);
      // prep next line processing
      const nextLineIndex = index + 1;
      // move up one if we are moving on to a new section
      if (isUpOne(lines, nextLineIndex)) {
        currentDepth--;
        if (currentFolder.parent) {
          currentFolder = currentFolder.parent;
        }
      } else if (isNewStructure(lines, nextLineIndex)) {
        currentDepth = 0;
        currentFolder = rootFolder;
      }
    }
  });
  return rootFolder;
}
