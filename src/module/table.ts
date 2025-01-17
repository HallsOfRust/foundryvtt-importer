import { UserData } from './importForm';
import { isRedditCollection, isRedditTable, parseRedditCollection, parseRedditTable } from './table.reddit';
import {
  BasicTable,
  FoundryTable,
  isCSVTable,
  isFoundryTable,
  isJSONTable,
  parseBasicJSON,
  parseFoundryJSON,
  parseFromCSV,
  parseFromTxt,
  TableData,
} from './table.process';
async function createTableFromJSON(tableJSON: FoundryTable | BasicTable) {
  console.log(`creating a table...`);
  let parsed: TableData | undefined;
  if (isFoundryTable(tableJSON)) {
    parsed = parseFoundryJSON(tableJSON as FoundryTable);
  } else {
    parsed = parseBasicJSON(tableJSON as BasicTable);
  }
  await RollTable.create(parsed);
}

async function jsonRoute(stringData: string) {
  const json = JSON.parse(stringData) as FoundryTable;
  createTableFromJSON(json);
}

const breakLines = (data: string) => {
  const rawLines = data.split(/\r?\n/);
  return rawLines.filter((line) => {
    return line !== '';
  });
};

async function txtRoute(fullFileName: string, stringData: string) {
  console.log(`Data: ${stringData}`);
  const lines = breakLines(stringData);
  const parsed = parseFromTxt({ name: fullFileName, entries: lines });
  await RollTable.create(parsed);
}

async function csvRoute(fullFileName: string, data: string) {
  console.log(`CSV Data: ${data}`);
  const lines = breakLines(data);
  const parse = parseFromCSV({ name: fullFileName, entries: lines });
  await RollTable.create(parse);
}

async function handleRedditCollection(input: string) {
  const parsed = parseRedditCollection(input);
  const folder = await Folder.create({ name: parsed.name, type: 'RollTable', sorting: 'm' });
  const promises = parsed.collection.map(async (table, index) => {
    return RollTable.create({ ...table, folder: folder?.data?._id, sort: index });
  });
  await Promise.all(promises);
}

async function redditTableRoute(input: string) {
  if (isRedditCollection(input)) {
    return handleRedditCollection(input);
  } else {
    const parsed = parseRedditTable(input);
    await RollTable.create(parsed);
  }
}

export async function processTableJSON({ jsonfile, clipboardInput }: UserData) {
  if (clipboardInput) {
    if (isJSONTable(clipboardInput)) {
      jsonRoute(clipboardInput);
    } else if (isCSVTable(clipboardInput)) {
      csvRoute('CSV Imported Table', clipboardInput);
    } else if (isRedditCollection(clipboardInput)) {
      redditTableRoute(clipboardInput);
    } else if (isRedditTable(clipboardInput)) {
      redditTableRoute(clipboardInput);
    } else {
      txtRoute('Line Imported Table', clipboardInput);
    }
    return;
  }
  const response = await fetch(jsonfile);
  if (!response.ok) {
    console.log(`Error reading ${jsonfile}`);
    return;
  }
  const data = await response.text();

  const ext = jsonfile.split('.').pop();
  switch (ext) {
    case 'json':
      jsonRoute(data);
      break;
    case 'txt':
      txtRoute(jsonfile, data);
      break;
    case 'csv':
      csvRoute(jsonfile, data);
      break;
    default:
      console.log(`Unknown file type ${ext}`);
  }
}
