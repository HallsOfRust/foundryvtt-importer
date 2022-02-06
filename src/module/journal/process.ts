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

export function parseJournal(input: string): ImportFolder {
  throw new Error('Not implemented');
}
