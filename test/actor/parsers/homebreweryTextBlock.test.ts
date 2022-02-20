import {
  parseAbilitiesHB,
  parseSkillsHB,
  parseFeaturesHB,
  parseRatingHB,
  parseSensesHB,
  parseHealthHB,
  parseNameHB,
  parseTypeHB,
  parseAlignmentHB,
  parseBiographyHB,
  parseLanguagesHB,
  parseSizeHB,
  parseACHB,
  parseDamageImmunitiesHB,
  parseDamageResistancesHB,
  parseConditionImmunitiesHB,
  parseDamageVulnerabilitiesHB,
  parseSpeedHB,
} from '../../../src/module/actor/parsers/homebreweryTextBlock';
import { textToActor } from '../../../src/module/actor/parsers';
import { parseGenericFormula } from '../../../src/module/actor/parsers/generic';

describe('parseName', () => {
  it('should parse a name', () => {
    const lines = ['___', '> ## Goblin'];
    expect(parseNameHB(lines)).toBe('Goblin');
  });
  it('should throw when passed an invalid name', () => {
    const lines = ['___', '## Goblin'];
    expect(() => parseNameHB(lines)).toThrow();
  });
  it('should throw when passed a non-markdown statblock', () => {
    const lines = ['Goblin'];
    expect(() => parseNameHB(lines)).toThrow();
  });
});

describe('parseBiography', () => {
  it('should parse a valid biography', () => {
    const lines = ['___', '> ## Goblin', '> *Small Humanoid (Goblinoid), Neutral Evil*'];
    expect(parseBiographyHB(lines)).toBe('Small Humanoid (Goblinoid), Neutral Evil');
  });
  it('should throw when not passed a biography', () => {
    const lines = ['only one line'];
    expect(() => parseBiographyHB(lines)).toThrow();
  });
});

describe('parseSize', () => {
  it('should parse a valid size', () => {
    const lines = ['___', '> ## Goblin', '> *Small Humanoid (Goblinoid), Neutral Evil*'];
    expect(parseSizeHB(lines)).toBe('Small');
  });
  it('should throw when passed an invalid size', () => {
    const lines = ['___', '> ## Goblin', '> *Smol Humanoid*'];
    expect(() => parseSizeHB(lines)).toThrow();
  });
});

describe('parseType', () => {
  it('should parse a valid type', () => {
    const lines = ['___', '> ## Goblin', '> *Small Humanoid (Goblinoid), Neutral Evil*'];
    expect(parseTypeHB(lines)).toBe('Humanoid');
  });
  it('should throw when passed an invalid type', () => {
    const lines = ['___', '> ## Goblin', '> *Small, Neutral Evil*'];
    expect(() => parseTypeHB(lines)).toThrow();
  });
});

describe('parseAlignment', () => {
  it('should parse a valid alignment', () => {
    const lines = ['___', '> ## Goblin', '> *Small Humanoid (Goblinoid), Neutral Evil*'];
    expect(parseAlignmentHB(lines)).toBe('Neutral Evil');
  });
  it('should throw when passed an invalid alignment', () => {
    const lines = ['___', '> ## Goblin', '> *Small Humanoid (Goblinoid)*'];
    expect(() => parseAlignmentHB(lines)).toThrow();
  });
});

describe('parseAC', () => {
  it('should parse a valid AC', () => {
    const lines = ['> - **Armor Class** 14 (natural armor)'];
    expect(parseACHB(lines)).toStrictEqual({
      value: 14,
      type: 'natural armor',
    });
  });
  it('should throw when passed an invalid AC', () => {
    const lines = ['> - **Armor Class** natural armor'];
    expect(() => parseACHB(lines)).toThrow();
  });
});

describe('parseHealth', () => {
  it('should parse a valid health', () => {
    const lines = ['> - **Hit Points** 104 (11d10 + 44)'];
    expect(parseHealthHB(lines)).toMatchObject({
      value: 104,
      max: (11 * 10 + 44),
      min: (11 + 44),
      str: '11d10 + 44',
    });
  });
  it('should throw when passed an invalid health', () => {
    const lines = ['> - **Hit Points** none (11d10 + 44'];
    expect(() => parseHealthHB(lines)).toThrow();
  });
});

describe('parseSpeed', () => {
  it('should parse a valid speed', () => {
    const lines = ['> - **Speed** 40 ft., climb 40 ft.'];
    expect(parseSpeedHB(lines)).toBe(40);
  });
  it('should throw when passed an invalid speed', () => {
    const lines = ['> - **Speed** some ft.'];
    expect(() => parseSpeedHB(lines)).toThrow();
  });
});

describe('parseAbilities', () => {
  it('should parse valid ability scores', () => {
    const lines = ['>|STR|DEX|CON|INT|WIS|CHA|', '>|:---:|:---:|:---:|:---:|:---:|:---:|', '>|10 (+0)|18 (+4)|12 (+1)|11 (+0)|12 (+1)|7 (-2)|'];
    expect(parseAbilitiesHB(lines)).toStrictEqual({
      str: {
        mod: 0,
        savingThrow: 0,
        value: 10,
      },
      dex: {
        mod: 4,
        savingThrow: 4,
        value: 18,
      },
      con: {
        mod: 1,
        savingThrow: 1,
        value: 12,
      },
      int: {
        mod: 0,
        savingThrow: 0,
        value: 11,
      },
      wis: {
        mod: 1,
        savingThrow: 1,
        value: 12,
      },
      cha: {
        mod: -2,
        savingThrow: -2,
        value: 7,
      },
    });
  });
  it('should throw when no ability scores are present', () => {
    const lines = ['>|STR|DEX|CON|INT|WIS|CHA|', '>|:---:|:---:|:---:|:---:|:---:|:---:|'];
    expect(() => parseAbilitiesHB(lines)).toThrow();
  });
  it('should throw when passed too many ability scores', () => {
    const lines = ['>|STR|DEX|CON|INT|WIS|CHA|', '>|:---:|:---:|:---:|:---:|:---:|:---:|', '>|10 (+0)|18 (+4)|12 (+1)|11 (+0)|12 (+1)|7 (-2)|8 (-1)|'];
    expect(() => parseAbilitiesHB(lines)).toThrow();
  });
});

describe('parseSenses', () => {
  it('should parse valid senses', () => {
    const lines = ['> - **Senses** blindsight 30 ft., passive Perception 8'];
    expect(parseSensesHB(lines)).toStrictEqual({
      blindsight: 30,
      passivePerception: 8,
      units: 'ft'
    });
  });
  it('should throw when passed invalid senses', () => {
    const lines = ['> - **Senses** blindsight'];
    expect(() => parseSensesHB(lines)).toThrow();
  });
});

describe('parseConditionImmunities', () => {
  it('should parse valid condition immunities', () => {
    const lines = ['> - **Condition Immunities** blinded and deafened'];
    expect(parseConditionImmunitiesHB(lines)).toEqual(['blinded', 'deafened']);
  });
  it('should throw when passed invalid condition immunities', () => {
    const lines = ['> - **Conditions** blinded, deafened'];
    expect(() => parseConditionImmunitiesHB(lines)).toThrow();
  });
});

describe('parseDamageVulnerabilities', () => {
  it('should parse valid damage vulnerabilities', () => {
    const lines = ['> - **Damage Vulnerabilities** slashing, fire'];
    expect(parseDamageVulnerabilitiesHB(lines)).toEqual(['slashing', 'fire']);
  });
  it('should throw when passed invalid damage vulnerabilities', () => {
    const lines = ['> - **Vulnerabilities** slashing, fire'];
    expect(() => parseDamageVulnerabilitiesHB(lines)).toThrow();
  });
});

describe('parseDamageResistances', () => {
  it('should parse valid damage resistances', () => {
    const lines = ['> - **Damage Resistances** slashing, fire'];
    expect(parseDamageResistancesHB(lines)).toEqual(['slashing', 'fire']);
  });
  it('should throw when passed invalid damage resistances', () => {
    const lines = ['> - **Resistances** slashing, fire'];
    expect(() => parseDamageResistancesHB(lines)).toThrow();
  });
});

describe('parseDamageImmunities', () => {
  it('should parse valid damage immunities', () => {
    const lines = ['> - **Damage Immunities** slashing, fire'];
    expect(parseDamageImmunitiesHB(lines)).toEqual(['slashing', 'fire']);
  });
  it('should throw when passed invalid damage immunities', () => {
    const lines = ['> - **Immunities** slashing, fire'];
    expect(() => parseDamageImmunitiesHB(lines)).toThrow();
  });
});

describe('parseSkills', () => {
  it('should parse valid skills', () => {
    const lines = ['> - **Skills** Stealth +4, Acrobatics +2'];
    expect(parseSkillsHB(lines)).toEqual([
      { name: 'stealth', bonus: 4 },
      { name: 'acrobatics', bonus: 2 },
    ]);
  });
  it('should throw when passed invalid skills', () => {
    const lines = ['> - **Skills** Stealth, Acrobatics +2'];
    expect(() => parseSkillsHB(lines)).toThrow();
  });
});

describe('parseLanguages', () => {
  it('should parse valid languages', () => {
    const lines = ['> - **Languages** Ignan, Common'];
    expect(parseLanguagesHB(lines)).toEqual(['ignan', 'common']);
  });
  it('should throw when passed invalid languages', () => {
    const lines = ['> - **Langs** Common'];
    expect(() => parseLanguagesHB(lines)).toThrow();
  });
});

describe('parseRating', () => {
  it('should parse a valid rating', () => {
    const lines = ['> - **Challenge** 2 (450xp)'];
    expect(parseRatingHB(lines)).toStrictEqual({
      cr: 2,
      xp: 450,
    });
  });
  it('should throw when passed an invalid rating', () => {
    const lines = ['> - **Ch** 2'];
    expect(() => parseRatingHB(lines)).toThrow();
  });
});

describe('parseFeatures', () => {
  it('should parse valid features', () => {
  });
});

