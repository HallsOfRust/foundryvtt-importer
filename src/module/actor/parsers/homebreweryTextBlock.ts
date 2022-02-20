// Parser for statblocks formatted for Homebrewery, GMBinder, and related tools.
import { parseItem } from '../../item/parsers';
import { getMaxAbility } from '../convert';
import {
  Abilities,
  Ability,
  ActorType,
  Alignment,
  ArmorClass,
  Biography,
  ConditionTypes,
  DamageType,
  Feature,
  Features,
  Health,
  ImportActor,
  ImportActorParser,
  ImportItems,
  Languages,
  Name,
  Rating,
  Senses,
  Size,
  Skill,
} from '../interfaces';
import { parseGenericFormula } from './generic';
import { parseACWTC, parseSensesWTC, parseRatingWTC } from './wtcTextBlock';

// TODO: return types are missing for some functions.
// TODO: throw exceptions on all functions, even optional ones.
// TODO: Other speeds

export function parseActorHB(): ImportActorParser {
  return {
    parseName: parseNameHB,
    parseRating: parseRatingHB,
    parseType: parseTypeHB,
    parseAlignment: parseAlignmentHB,
    parseBiography: parseBiographyHB,
    parseLanguages: parseLanguagesHB,
    parseSize: parseSizeHB,
    parseHealth: parseHealthHB,
    parseSenses: parseSensesHB,
    parseArmorClass: parseACHB,
    parseDamageImmunities: parseDamageImmunitiesHB,
    parseDamageResistances: parseDamageResistancesHB,
    parseConditionImmunities: parseConditionImmunitiesHB,
    parseDamageVulnerabilities: parseDamageVulnerabilitiesHB,
    parseAbilities: parseAbilitiesHB,
    parseSpeed: parseSpeedHB,
    parseSkills: parseSkillsHB,
    parseItems: parseItemsHB,
  };
}

export function parseNameHB(lines: string[]): Name {
  if (!lines[0].match(/^___/)) {
    throw new Error(`Could not parse Homebrewery statblock, missing first line "___"`);
  }
  // Matches "> ## Goblin".
  const nameMatch = lines[1].match(/> ?## ?(.*)/);
  if (!nameMatch) {
    throw new Error(`Could not parse name from: "${lines[1]}".`);
  }
  return nameMatch[1];
}

export function parseBiographyHB(lines: string[]): Biography {
  return lines[2].replace(/[>\-*]/g, '').trim();
}

export function parseSizeHB(lines: string[]): Size {
  const sizes = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
  const descriptionCandidate = lines[2].toLowerCase();
  const size = sizes.find((s) => descriptionCandidate.includes(s.toLowerCase()));
  if (!size) {
    throw new Error(`Could not parse size from: "${lines[2]}"."`);
  }
  return size as Size;
}

export function parseTypeHB(lines: string[]): ActorType {
  const size = parseSizeHB(lines) as string;
  const descriptionLine = lines[2];
  const afterSize = descriptionLine.substr(descriptionLine.indexOf(size) + size.length);
  if (!afterSize.includes(',')) {
    throw new Error(`Could not parse type from: "${lines[2]}". Description should include a comma.`);
  }
  // If the type looks like "Humanoid (Goblinoid)", we keep only "Humanoid".
  const type = afterSize.split(',')[0].replace(/\(.*/, '').trim();
  if (type === '') {
    throw new Error(`Could not parse type from: "${lines[2]}".`);
  }
  return type;
}

export function parseAlignmentHB(lines: string[]): Alignment {
  const descriptionLine = lines[2];
  if (!descriptionLine.includes(',')) {
    throw new Error(`Could not parse alignment from: ${lines[2]}. Description should include a comma.`);
  }
  const alignment = descriptionLine.replace(/\*/g, '').split(',')[1].trim() as Alignment;
  if (alignment === '') {
    throw new Error(`Could not parse type from: "${lines[2]}".`);
  }
  return alignment;
}

export function parseACHB(lines: string[]): ArmorClass {
  const acLine = lines.find((line) => line.includes('Armor Class'));
  if (!acLine) {
    throw new Error(`Could not find "Armor Class" in input.`);
  }
  // acLine looks like "> - **Armor Class** 16 (natural armor)".
  // Remove '>' and '*'.
  const acLineSanitized = acLine.replace(/[->*]/, '');
  return parseACWTC([acLineSanitized]);
}

export function parseHealthHB(lines: string[]): Health {
  const healthLine = lines.find((line) => line.includes('Hit Points'));
  if (!healthLine) {
    throw new Error(`Could not find "Hit Points" in input.`);
  }
  // healthLine looks like "> - **Hit Points** 33 (6d6 + 12)".
  const health = parseGenericFormula(healthLine, /Hit Points\*{0,2} (.*)/);
  if (!(health as Health).value) {
    throw new Error(`Could not parse health from: "${healthLine}".`);
  }
  return health;
}

export function parseSpeedHB(lines: string[]) {
  const speedLine = lines.find((line) => line.includes('Speed'));
  if (!speedLine) {
    throw new Error(`Could not find "Speed" in input.`);
  }
  const speedMatch = speedLine.match(/(\d+)/);
  if (!speedMatch) {
    throw new Error(`Could not parse speed from: "${speedLine}". Speed line should include a number.`);
  }
  return Number(speedMatch[1]);
}

export function parseAbilitiesHB(lines: string[]): Abilities {
  const abilityHeader = '|STR|DEX|CON|INT|WIS|CHA|';
  const abilityHeaderIndex = lines.findIndex((line) => line.includes(abilityHeader));
  if (abilityHeaderIndex === -1) {
    throw new Error(`Could not find "${abilityHeader}" in input.`);
  }
  if (abilityHeaderIndex >= lines.length - 2) {
    throw new Error(`Found "${abilityHeader}" too late in input`);
  }
  const abilityValuesLine = lines[abilityHeaderIndex + 2];
  // abilityValuesLine looks like ">|13 (+1)|16 (+3)|12 (+1)|3 (-4)|14 (+2)|7 (-2)|".
  // Ignore what comes before the first '|'.
  const abilityValueCells = abilityValuesLine.split('|').slice(1, -1);
  const abilityValues: number[] = [];
  abilityValueCells.forEach((cell) => {
    const abilityMatch = cell.match(/(\d+)/);
    if (!abilityMatch) {
      throw new Error(`Could not parse ability score value from "${cell}" in "${abilityValuesLine}".`);
    }
    // We only care about the raw score, not the modifier.
    abilityValues.push(parseInt(abilityMatch[1]));
  });
  if (abilityValues.length != 6) {
    throw new Error(`Expected exactly 6 ability scores, found ${abilityValues.length} instead.`);
  }
  const abilities: Ability[] = [];
  abilityValues.forEach((value) => {
    // Just calculate the mod to cover up mistakes in the source.
    const mod = Math.floor((value - 10) / 2);
    abilities.push({
      value: value,
      mod: mod,
      savingThrow: mod,
    });
  });
  return {
    str: abilities[0],
    dex: abilities[1],
    con: abilities[2],
    int: abilities[3],
    wis: abilities[4],
    cha: abilities[5],
  };
}

export function parseSensesHB(lines: string[]): Senses {
  const sensesLine = lines.find((line) => line.includes('Senses'));
  if (!sensesLine) {
    throw new Error(`Could not find "Senses" in input`);
  }
  // sensesLine looks like '> - **Senses** blindsight 30 ft., passive Perception 8'.
  // Remove '>', '-', and '*'.
  const sensesLineSanitized = sensesLine.replace(/[>\*-]/g, '');
  return parseSensesWTC([sensesLineSanitized]);
}

// Parse a named line with multiple items, like Condition Immunities.
// Example: '> - **Damage Vulnerabilities** fire'.
// The 'name' here is 'Damage Vulnerabilities'.
function parseLineWithCommaSeparatedItems(name: string, lines: string[]): string[] {
  const line = lines.find((line) => line.includes(name));
  if (!line) {
    throw new Error(`Could not find "${name}" in input.`);
  }
  const itemsMatch = line.match(new RegExp(name + '\\*{0,2}(.*)'));
  if (!itemsMatch) {
    throw new Error(`Could not parse ${name} from "${line}".`);
  }
  return itemsMatch[1]
    .replace('and', ',')
    .trim()
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item);
}

export function parseConditionImmunitiesHB(lines: string[]) {
  return parseLineWithCommaSeparatedItems('Condition Immunities', lines) as ConditionTypes;
}

export function parseDamageVulnerabilitiesHB(lines: string[]) {
  return parseLineWithCommaSeparatedItems('Damage Vulnerabilities', lines) as DamageType[];
}

export function parseDamageResistancesHB(lines: string[]) {
  return parseLineWithCommaSeparatedItems('Damage Resistances', lines) as DamageType[];
}

export function parseDamageImmunitiesHB(lines: string[]) {
  return parseLineWithCommaSeparatedItems('Damage Immunities', lines) as DamageType[];
}

export function parseSkillsHB(lines: string[]): Skill[] {
  const rawSkills = parseLineWithCommaSeparatedItems('Skills', lines);
  const skills: Skill[] = [];
  for (const rawSkill of rawSkills) {
    // rawSkill looks like 'Stealth +4'.
    const skillMatch = rawSkill.match(/(\w+) ?\+?([\-\d]+)/);
    if (!skillMatch || skillMatch.length != 3) {
      throw new Error(`Could not parse skill from "${rawSkill}".`);
    }
    skills.push({
      name: skillMatch[1].trim().toLowerCase(),
      bonus: Number(parseInt(skillMatch[2])),
    });
  }
  return skills;
}

export function parseLanguagesHB(lines: string[]): Languages {
  return parseLineWithCommaSeparatedItems('Languages', lines).map((lang) => lang.toLowerCase());
}

export function parseRatingHB(lines: string[]): Rating {
  const challengeLine = lines.find((line) => line.includes('Challenge'));
  if (!challengeLine) {
    throw new Error(`Could not find "Challenge" in input.`);
  }
  // challengeLine looks like '> - **Challenge** 2 (450xp)'.
  const challengeLineSanitized = challengeLine.replace(/[>\-*]/g, '').trim();
  return parseRatingWTC([challengeLineSanitized]);
}

interface FeaturesAndActions {
  features: string[];
  actions: string[];
}

function getFeaturesAndActions(lines: string[]): FeaturesAndActions {
  let sectionCount = 0;
  let featuresActionsStart = -1;
  let featuresActionsEnd = -1;
  lines.forEach((line, i) => {
    // TODO: Revisit assumptions around where these start.
    // The features and actions block starts after the 4th '> ___'.
    if (line.match(/^> ?___/) && ++sectionCount === 4) {
      featuresActionsStart = i + 1;
    }
    // The features and actions block ends after the 5th '> ___' or a blank line.
    if (line.match(/^( ?|> ?___)/) && sectionCount === 5) {
      featuresActionsEnd = i;
    }
  });
  if (featuresActionsStart === -1) {
    throw new Error(`Could not find the features and actions block in input.`);
  }
  if (featuresActionsEnd === -1) {
    featuresActionsEnd = lines.length;
  }
  // TODO: Legendary actions.
  // TODO: Lair actions.
  const actionsStart = lines.findIndex((line) => line.match(/^> ?### Actions/));
  if (!actionsStart) {
    throw new Error(`Could not find "> ### Actions" in input.`);
  }
  return {
    features: lines.slice(featuresActionsStart, actionsStart),
    actions: lines.slice(actionsStart, featuresActionsEnd),
  };
}

interface RawFeatureOrAction {
  name: string;
  content: string; // May contain newlines.
}

function splitFeaturesOrActions(lines: string[]): RawFeatureOrAction[] {
  // Features and actions look like '> ***Bite.*** *Melee Weapon Attack:* +8 to hit...'.
  // First we split on the names ('> ***Bite') to discover all features / actions.
  const rawFeaturesOrActions = lines
    .join('\n')
    .split(/> ?\*{2-3}/g)
    .map((item) => item.trim());
  const featuresOrActions: RawFeatureOrAction[] = [];
  rawFeaturesOrActions.forEach((item) => {
    const contentMatch = item.match(/([^*.]+)\.?\*{2-3}(.*)/);
    if (!contentMatch || contentMatch.length != 2) {
      return;
    }
    featuresOrActions.push({
      name: contentMatch[1],
      content: contentMatch[2].replace(/>/g, ''),
    });
  });
  return featuresOrActions;
}

export function parseFeaturesHB(lines: string[]): Features {
  const rawFeatures = splitFeaturesOrActions(getFeaturesAndActions(lines).features);
  return rawFeatures.map((feature) => {
    return {
      name: feature.name,
      description: feature.content.replace(/\*/g, ''),
    };
  });
}

// Parses actions, which are represented as items in Foundry 5e.
export function parseItemsHB(lines: string[], abilities: Abilities): ImportItems {
  const rawActions = splitFeaturesOrActions(getFeaturesAndActions(lines).actions);
  return rawActions.map((action) =>
    parseItem(action.name, action.content.replace(/[-*]/g, ''), getMaxAbility(abilities)),
  );
}
