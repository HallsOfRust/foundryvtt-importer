import { JournalNode } from './process';

export async function buildJournal(root: JournalNode) {
  let currentFolder: JournalNode | undefined = root;
  let parentFolder = undefined;
  do {
    console.log(`Making folder ${currentFolder.name}`);
    parentFolder = await Folder.create({
      name: currentFolder.name,
      parent: parentFolder !== undefined ? parentFolder?.data?._id : undefined,
      type: 'JournalEntry',
      sorting: 'm',
    });
    while (currentFolder?.entries?.length !== undefined && currentFolder?.entries?.length > 0) {
      const entry = currentFolder?.entries?.shift();
      console.log(`Making entry ${entry?.name}`);
      if (entry) {
        await JournalEntry.create({
          name: entry.name,
          parent: parentFolder?.data?._id,
          type: 'JournalEntry',
          sorting: 'm',
          content: entry.content,
        });
      }
    }
    currentFolder = currentFolder?.subfolders?.shift();
  } while (currentFolder?.subfolders?.length !== undefined && currentFolder?.subfolders?.length > 0);
}
