import {
  parseAbilitiesWTC,
  parseSkillsWTC,
  parseFeaturesFromBlock,
  findFirstSectionIndex,
  parseStandardCSV,
  parseFeatureSections,
  featureFromSection,
  parseMultilineAbilitiesWTC,
  getFeatureNames,
  parseFeaturesWTC,
  parseRatingWTC,
  findStatBounds,
  getVerticalKeyValueAbilities,
  tryStatParsers,
  parseSensesWTC,
  parseHealthWTC,
  parseNameWTC,
  parseTypeWTC,
  parseAlignmentWTC,
  parseBiographyWTC,
  parseLanguagesWTC,
  parseSizeWTC,
  parseACWTC,
  parseDamageImmunitiesWTC,
  parseDamageResistancesWTC,
  parseConditionImmunitiesWTC,
  parseDamageVulnerabilitiesWTC,
  parseVerticalKeyValueAbilitiesWTC,
  parseSpeedWTC,
} from '../../../src/module/actor/parsers/wtcTextBlock';
import { textToActor } from '../../../src/module/actor/parsers';
import { parseGenericFormula } from '../../../src/module/actor/parsers/generic';

describe('nameParse', () => {
  it('should parse a name', () => {
    const text = ['Nimblewright'];
    expect(parseNameWTC(text)).toEqual('Nimblewright');
  });

  it('should throw when passed an invalid name', () => {
    const text: string[] = [];
    expect(() => parseNameWTC(text)).toThrow();
  });
});

describe('Rating', () => {
  it('should parse a rating', () => {
    const text = ['Challenge 9 (5,000 XP)'];
    expect(parseRatingWTC(text)).toEqual({ xp: 5000, cr: 9 });
  });

  it('should throw when passed an invalid rating', () => {
    const text: string[] = [];
    expect(() => parseRatingWTC(text)).toThrow();
  });
});

describe('parseType', () => {
  it('should parse a valid type string', () => {
    const type = parseTypeWTC(['Medium humanoid (warforged), neutral evil']);
    expect(type).toBe('humanoid');
  });
  it('should throw an error when not passed a valid type string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseTypeWTC(invalid);
    }).toThrow();
  });
});

describe('parseAlignment', () => {
  it('should parse a valid alignment string', () => {
    const alignment = ['Medium humanoid (warforged), neutral evil'];
    expect(parseAlignmentWTC(alignment)).toBe('Neutral Evil');
  });
  it('should throw an error when not passed a valid alignment string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseAlignmentWTC(invalid);
    }).toThrow();
  });
});

describe('parseBiography', () => {
  it('should parse a valid biography string', () => {
    const biography = ['Medium humanoid (warforged), neutral evil'];
    expect(parseBiographyWTC(biography)).toBe('Medium humanoid (warforged), neutral evil');
  });
  it('should throw an error when not passed a valid biography string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseBiographyWTC(invalid);
    }).toThrow();
  });
});

describe('parseLanguages', () => {
  it('should parse a valid languages string', () => {
    const languages = ['Languages Common, Dwarvish, Elvish, Giant, Gnomish, Goblin, Orc'];
    expect(parseLanguagesWTC(languages)).toEqual(['common', 'dwarvish', 'elvish', 'giant', 'gnomish', 'goblin', 'orc']);
  });
  it('should throw an error when not passed a valid languages string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseLanguagesWTC(invalid);
    }).toThrow();
  });
});

describe('findStatBounds', () => {
  it('should find bounds of statblock', () => {
    const actorText =
      'Big Bara\nMedium humanoid (warforged), neutral evil\nArmor Class 18 (natural armor, Imposing Majesty)\nHit Points 117 (18d8 + 36)\nSpeed 30 ft.\nSTR\n DEX\n CON\n INT\n WIS\n CHA\n14 (+2)\n 17 (+3)\n 15 (+2)\n 13 (+1)\n 16 (+3)\n 18 (+4)\nSaving Throws Con +6, Wis +7\nSkills Perception +7, Survival +7\nDamage Immunities poison\nCondition Immunities charmed, frightened, poisoned\nSenses darkvision 60 ft., passive Perception 17\nLanguages Common\nChallenge 9 (5,000 XP)\nImposing Majesty. Big Bara adds her Charisma bonus to her AC\n(included above).\nWarforged Resilience. Big Bara is immune to disease and magic\ncan’t put her to sleep.\nActions\nMultiattack. Big Bara makes two attacks, either with her\nshortsword or armbow.\nShortsword. Melee Weapon Attack: +7 to hit, reach 5 ft., one\ntarget. Hit: 6 (1d6 + 3) piercing damage plus 13 (3d8) poi-\nson damage.\nArmbow. Ranged Weapon Attack: +7 to hit, range 30/120 ft.,\none target. Hit: 10 (2d6 +3) piercing damage plus 13 (3d8) poi-\nson damage.\nPoisonous Cloud (2/Day). Poison gas fills a 20-foot-radius\nsphere centered on a point Big Bara can see within 50 feet of\nher. The gas spreads around corners and remains until the start\nof Big Bara’s next turn. Each creature that starts its turn in the\ngas must succeed on a DC 16 Constitution saving throw or be\npoisoned for 1 minute. A creature can repeat the saving throw\nat the end of each of its turns, ending the effect on itself on\na success.';
    const lines = actorText.split('\n');
    const { firstLine, lastLine } = findStatBounds(lines);
    expect(lines[firstLine]).toBe('STR');
    expect(lines[lastLine - 1].trim()).toBe('18 (+4)');
  });
});

describe('parseSize', () => {
  it('should parse a valid size string', () => {
    const size = parseSizeWTC(['Medium humanoid (warforged), neutral evil']);
    expect(size).toBe('Medium');
  });
  it('should throw an error when not passed a valid size string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseSizeWTC(invalid);
    }).toThrow();
  });
});

describe('parseHealth', () => {
  it('should parse a valid health string', () => {
    const health = parseGenericFormula('Hit Points 66 (12d8 + 12)', /Hit Points (.*)/);
    expect(health.value).toBe(66);
    expect(health.max).toBe(12 * 8 + 12);
    expect(health.min).toBe(12 + 12);
    expect(health.str).toBe('12d8 + 12');
  });
  it('should throw an error when not passed a valid health string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseHealthWTC(invalid);
    }).toThrow();
  });
});

describe('parseSenses', () => {
  it('should parse a valid senses string', () => {
    const senses = parseSensesWTC(['Senses darkvision 60 ft., passive Perception 17']);
    expect(senses).toStrictEqual({ darkvision: 60, units: 'ft' });
  });
  it('should throw an error when not passed a valid senses string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseSensesWTC(invalid);
    }).toThrow();
  });
});

describe('parseAC', () => {
  it('should parse a valid ac string', () => {
    const ac = parseACWTC(['Armor Class 18 (natural armor, Imposing Majesty)']);
    expect(ac).toStrictEqual({
      value: 18,
      type: 'natural armor, Imposing Majesty',
    });
  });
  it('should throw an error when not passed a valid ac string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseACWTC(invalid);
    }).toThrow();
  });
});

describe('parseDamageImmunities', () => {
  it('should parse a valid damage immunities string', () => {
    const damageImmunities = parseDamageImmunitiesWTC(['Damage Immunities poison']);
    expect(damageImmunities).toStrictEqual(['poison']);
  });
  it('should throw an error when not passed a valid damage immunities string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseDamageImmunitiesWTC(invalid);
    }).toThrow();
  });
});

describe('damageResistancesParsers', () => {
  it('should parse a valid damage resistances string', () => {
    const damageResistances = parseDamageResistancesWTC(['Damage Resistances fire, poison']);
    expect(damageResistances).toStrictEqual(['fire', 'poison']);
  });
  it('should throw an error when not passed a valid damage resistances string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseDamageResistancesWTC(invalid);
    }).toThrow();
  });
});

describe('conditionImmunities', () => {
  it('should parse a valid condition immunities string', () => {
    const conditionImmunities = parseConditionImmunitiesWTC(['Condition Immunities charmed, frightened, poisoned']);
    expect(conditionImmunities).toStrictEqual(['charmed', 'frightened', 'poisoned']);
  });
  it('should throw an error when not passed a valid condition immunities string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseConditionImmunitiesWTC(invalid);
    }).toThrow();
  });
});

describe('damageVulderabilityParsers', () => {
  it('should parse a valid damage vulnerabilities string', () => {
    const damageVulnerabilities = parseDamageVulnerabilitiesWTC(['Damage Vulnerabilities fire, psychic']);
    expect(damageVulnerabilities).toStrictEqual(['fire', 'psychic']);
  });
  it('should throw an error when not passed a valid damage vulnerabilities string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseDamageVulnerabilitiesWTC(invalid);
    }).toThrow();
  });
});

describe('parseAbilitiesWTC', () => {
  it('should parse a valid abilities string', () => {
    const abilities = parseAbilitiesWTC(['STR DEX CON INT WIS CHA', '18 (+4) 11 (+0) 14 (+2) 13 (+0) 15 (+1) 11 (+0)']);
    expect(abilities).toStrictEqual({
      cha: {
        mod: 0,
        savingThrow: 0,
        value: 11,
      },
      con: {
        mod: 2,
        savingThrow: 0,
        value: 14,
      },
      dex: {
        mod: 0,
        savingThrow: 0,
        value: 11,
      },
      int: {
        mod: 0,
        savingThrow: 0,
        value: 13,
      },
      str: {
        mod: 4,
        savingThrow: 0,
        value: 18,
      },
      wis: {
        mod: 1,
        savingThrow: 0,
        value: 15,
      },
    });
  });
  it('should throw an error when not passed a valid abilities string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseAbilitiesWTC(invalid);
    }).toThrow();
  });
});

describe('parseMultilineAbilitiesWTC', () => {
  it('should parse a valid multi line abilities string', () => {
    const abilities = parseMultilineAbilitiesWTC([
      'STR',
      '12 (+1)',
      'DEX',
      '18 (+4)',
      'CON',
      '12 (+1)',
      'INT',
      '14 (+2)',
      'WIS',
      '11 (+0)',
      'CHA',
      '15 (+2)',
    ]);
    expect(abilities).toStrictEqual({
      cha: {
        mod: 2,
        savingThrow: 0,
        value: 15,
      },
      con: {
        mod: 1,
        savingThrow: 0,
        value: 12,
      },
      dex: {
        mod: 4,
        savingThrow: 0,
        value: 18,
      },
      int: {
        mod: 2,
        savingThrow: 0,
        value: 14,
      },
      str: {
        mod: 1,
        savingThrow: 0,
        value: 12,
      },
      wis: {
        mod: 0,
        savingThrow: 0,
        value: 11,
      },
    });
  });
  it('should throw an error when not passed a valid abilities string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseMultilineAbilitiesWTC(invalid);
    }).toThrow();
  });
});

describe('parseVerticalKeyValueAbilities', () => {
  it('should parse a valid vertical key value abilities string', () => {
    const abilities = parseVerticalKeyValueAbilitiesWTC([
      'STR',
      'DEX',
      'CON',
      'INT',
      'WIS',
      'CHA',
      '18 (+4)',
      '12 (+1)',
      '14 (+2)',
      '11 (+0)',
      '15 (+2)',
      '13 (+0)',
    ]);
    expect(abilities).toStrictEqual({
      cha: {
        mod: 0,
        savingThrow: 0,
        value: 13,
      },
      con: {
        mod: 2,
        savingThrow: 0,
        value: 14,
      },
      dex: {
        mod: 1,
        savingThrow: 0,
        value: 12,
      },
      int: {
        mod: 0,
        savingThrow: 0,
        value: 11,
      },
      str: {
        mod: 4,
        savingThrow: 0,
        value: 18,
      },
      wis: {
        mod: 2,
        savingThrow: 0,
        value: 15,
      },
    });
  });
});

describe('parseSpeed', () => {
  it('should parse a valid speed string', () => {
    const speed = parseSpeedWTC(['Speed 30 ft.']);
    expect(speed).toBe(30);
  });
  it('should throw an error when not passed a valid speed string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseSpeedWTC(invalid);
    }).toThrow();
  });
});

describe('parseFeatures', () => {
  it('should parse a valid features string', () => {
    const features = parseFeaturesWTC([
      'Imposing Majesty. Big Bara adds her Charisma bonus to her AC',
      '(included above).',
      'Warforged Resilience. Big Bara is immune to disease and magic',
      'can’t put her to sleep.',
      'Actions',
      'Multiattack. Big Bara makes two attacks, either with her',
      'shortsword or armbow.',
      'Shortsword. Melee Weapon Attack: +7 to hit, reach 5 ft., one',
      'target. Hit: 6 (1d6 + 3) piercing damage plus 13 (3d8) poi-',
      'son damage.',
      'Armbow. Ranged Weapon Attack: +7 to hit, range 30/120 ft.,',
      'one target. Hit: 10 (2d6 +3) piercing damage plus 13 (3d8) poi-',
      'son damage.',
      'Poisonous Cloud (2/Day). Poison gas fills a 20-foot-radius',
      'sphere centered on a point Big Bara can see within 50 feet of',
      'her. The gas spreads around corners and remains until the start',
      'of Big Bara’s next turn. Each creature that starts its turn in the',
      'gas must succeed on a DC 16 Constitution saving throw or be',
      'poisoned for 1 minute. A creature can repeat the saving throw',
      'at the end of each of its turns, ending the effect on itself on',
      'a success.',
    ]);
    expect(features).toStrictEqual([
      { description: 'Big Bara adds her Charisma bonus to her AC (included above).', name: 'Imposing Majesty' },
      {
        description: 'Big Bara is immune to disease and magic can’t put her to sleep. Actions',
        name: 'Warforged Resilience',
      },
      { description: 'Big Bara makes two attacks, either with her shortsword or armbow.', name: 'Multiattack' },
      {
        description:
          'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage plus 13 (3d8) poison damage.',
        name: 'Shortsword',
      },
      {
        description:
          'Ranged Weapon Attack: +7 to hit, range 30/120 ft., one target. Hit: 10 (2d6 +3) piercing damage plus 13 (3d8) poison damage.',
        name: 'Armbow',
      },
      {
        description:
          'Poison gas fills a 20-foot-radius sphere centered on a point Big Bara can see within 50 feet of her. The gas spreads around corners and remains until the start of Big Bara’s next turn. Each creature that starts its turn in the gas must succeed on a DC 16 Constitution saving throw or be poisoned for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.',
        name: 'Poisonous Cloud (2/Day)',
      },
    ]);
  });
  it('should throw an error when not passed a valid features string', () => {
    const invalid = ['invalid'];
    expect(() => {
      parseFeaturesWTC(invalid);
    }).toThrow();
  });

  it('should parse both features', () => {
    const actorText =
      'Swashbuckler\nMedium humanoid (any race), any non-lawful alignment\n\nArmor Class 17 (leather armor)\nHit Points 66 (12d8 + 12)\nSpeed 30 ft.\n\n   STR        DEX         CON        INT        WIS         CHA\n  12 (+1)    18 (+4)     12 (+1)    14 (+2)    11 (+0)     15 (+2)\n\nSkills Acrobatics +8, Athletics +5, Persuasion +6\nSenses passive Perception 10\nLanguages any one language (usually Common)\nChallenge 3 (700 XP)\n\nLightfooted. The swashbuckler can take the Dash or Disengage\naction as a bonus action on each of its turns.\n\nSuave Defense. While the swashbuckler is wearing light or no\narmor and wielding no shield, its AC includes its Charisma\nmod.\n\nActions\n\nMultiattack. The swashbuckler makes three attacks: one with\na dagger and two with its rapier.\nDagger. Melee or Ranged Weapon Attack: +6 to hit, reach 5\nft. or range 20/60 ft., one target. Hit: 6 (1d4 + 4) piercing\ndamage.\nRapier. Melee Weapon Attack: +6 to hit, reach 5 ft., one target.\nHit: 8 (1d8 + 4) piercing damage.';
    const featureSplit = actorText.split('\n\n');
    const features = parseFeaturesFromBlock(featureSplit, 4);
    expect(features).toEqual([
      {
        name: 'Lightfooted',
        description: 'The swashbuckler can take the Dash or Disengage action as a bonus action on each of its turns.',
      },
      {
        name: 'Suave Defense',
        description:
          'While the swashbuckler is wearing light or no armor and wielding no shield, its AC includes its Charisma mod.',
      },
    ]);
  });

  it('should parse a sea hag', () => {
    const actorText =
      'Sea Spawn\nMedium humanoid, neutral evil\n                                                                   \nArmor Class 11 (natural armor)\nHit Points 32 (5d8 + 10)\nSpeed 20 ft., swim 30 ft.\n                                                                   \n   STR        DEX        CON          INT       WIS         CHA\n  15 (+2)     8 (-1)    15 (+2)      6 (-2)    10 (+0)      8 (-1)\n                                                                   \nSenses darkvision 120 ft., passive Perception 10\nLanguages understands Aquan and Common but can’t speak\nChallenge 1 (200 XP)\n                                                                   \nLimited Amphibiousness. The sea spawn can breathe air and\nwater, but needs to be submerged in the sea at least once a\nday for 1 minute to avoid suffocating.\n                                                                   \nActions\nMultiattack. The sea spawn makes three attacks: two\nunarmed strikes and one with its Piscine Anatomy.\n                                                                   \nUnarmed Strike. Melee Weapon Attack: +4 to hit, reach 5 ft.,\none target. Hit: 4 (1d4 + 2) bludgeoning damage.\n                                                                   \nPiscine Anatomy. The sea spawn has one or more of the\nfollowing attack options, provided it has the appropriate\nanatomy:\n                                                                   \n  Bite. Melee Weapon Attack: +5 to hit, reach 5 ft., one target.\n  Hit: 4 (1d4 + 2) piercing damage.\n                                                                   \n  Poison Quills. Melee Weapon Attack: +5 to hit, reach 5 ft.,\n  one creature. Hit: 3 (1d6) poison damage, and the target\n  must succeed on a DC 12 Constitution saving throw or be\n  poisoned for 1 minute. The target can repeat the saving\n  throw at the end of each of its turns, ending the effect on\n  itself on a success.\n  Tentacle. Melee Weapon Attack: +5 to hit, reach 10 ft., one\n  target. Hit: 5 (1d6 + 2) bludgeoning damage, and the target\n  is grappled (escape DC 12) if it is a Medium or smaller\n                                                                   \n  creature. Until this grapple ends, the sea spawn can’t use\n                                                                   \n  this tentacle on another target';
    const sections = parseFeatureSections(actorText);
    const { features } = featureFromSection(sections, 'actions');
    expect(features.length).toBe(6);
  });

  it('should parse a different monster', () => {
    const actorText =
      'Nimblewright                                                   \n     Medium construct, unaligned                                      \n\n     Armor Class 18 (natural armor)                                   \n     Hit Points 45 (6d8 + 18)                                         \n     Speed 60 ft.                                                     \n\n        STR        DEX        CON          INT       WIS        CHA   \n       12 (+1)    18 (+4)    17 (+3)      8 (-1)    10 (+0)     6 (-2)\n\n     Saving Throws Dex +6                                             \n     Skills Acrobatics +8, Perception +2                              \n     Damage Resistances bludgeoning, piercing and slashing from       \n     nonmagical effects\n     Condition Immunities exhaustion, frightened, petrified, poisoned \n     Senses darkvision 60 ft., passive Perception 12                  \n     Languages understands one language known to its creator but      \n     can’t speak\n     Challenge 4 (1,100 XP)                                           \n                                                                      \n     Magic Resistance. The nimblewright has advantage on saving       \n     throws against spells and other magical effects.\n                                                                      \n     Magic Weapons. The nimblewright’s weapon attacks are             \n     magical.\n                                                                      \n     Repairable. As long as it has at least 1 hit point remaining, the\n     nimblewright regains 1 hit point when a mending spell is cast    \n     on it.\n                                                                      \n     Sure Footed. The nimblewright has advantage on Strength and      \n     Dexterity saving throws made against effects that would knock\n     it prone.                                                        \n                                                                      \n     Actions                                                          \n                                                                      \n     Multiattack. The nimblewright makes three attacks: two with      \n     its rapier and one with its dagger..                             \n     Rapier. Melee Weapon Attack: +6 to hit, reach 5 ft., one target. \n     Hit: 8 (1d8 + 4) piercing damage.                                \n                                                                      \n     Dagger. Melee or Ranged Weapon Attack: +6 to hit, reach 5ft. or\n                                                                      \n     range 20/60 ft., one target. Hit: 6 (1d4 + 4) piercing damage.\n                                                                      \n     Reactions\n     Parry. The nimblewright adds 2 to its AC against one melee\n     attack that would hit it. To do so, the nimblewright must see\n     the attacker and be wielding a melee weapon.';
    const sections = parseFeatureSections(actorText);
    const { features } = featureFromSection(sections, 'features');
    expect(features).toBeDefined();
    expect(sections.length).toBe(3);
    expect(features).toHaveLength(4);
    expect(features[0].name).toBe('Magic Resistance');
    expect(features[1].name).toBe('Magic Weapons');
    const { features: actions } = featureFromSection(sections, 'actions');
    expect(actions).toHaveLength(3);
    expect(actions[0].name).toBe('Multiattack');
  });
});

describe('extractAbilities', () => {
  it('should extract abilities from a valid string', () => {
    const actorText =
      'Swashbuckler\nMedium humanoid (any race), any non-lawful alignment\n\nArmor Class 17 (leather armor)\nHit Points 66 (12d8 + 12)\nSpeed 30 ft.\n\n   STR        DEX         CON        INT        WIS         CHA\n  12 (+1)    18 (+4)     12 (+1)    14 (+2)    11 (+0)     15 (+2)\n\nSkills Acrobatics +8, Athletics +5, Persuasion +6\nSenses passive Perception 10\nLanguages any one language (usually Common)\nChallenge 3 (700 XP)\n\nLightfooted. The swashbuckler can take the Dash or Disengage\naction as a bonus action on each of its turns.\n\nSuave Defense. While the swashbuckler is wearing light or no\narmor and wielding no shield, its AC includes its Charisma\nmod.\n\nActions\n\nMultiattack. The swashbuckler makes three attacks: one with\na dagger and two with its rapier.\nDagger. Melee or Ranged Weapon Attack: +6 to hit, reach 5\nft. or range 20/60 ft., one target. Hit: 6 (1d4 + 4) piercing\ndamage.\nRapier. Melee Weapon Attack: +6 to hit, reach 5 ft., one target.\nHit: 8 (1d8 + 4) piercing damage.';
    const abilities = parseAbilitiesWTC(actorText.split('\n'));
    expect(abilities).toEqual({
      str: {
        value: 12,
        mod: 1,
        savingThrow: 0,
      },
      dex: {
        value: 18,
        mod: 4,
        savingThrow: 0,
      },
      con: {
        value: 12,
        mod: 1,
        savingThrow: 0,
      },
      int: {
        value: 14,
        mod: 2,
        savingThrow: 0,
      },
      wis: {
        value: 11,
        mod: 0,
        savingThrow: 0,
      },
      cha: {
        value: 15,
        mod: 2,
        savingThrow: 0,
      },
    });
  });

  it('Should parse a Goblin', () => {
    const actorText =
      'Goblin\nMedium humanoid (goblin), chaotic evil\nArmor Class 13 (natural armor)\nHit Points 52 (8d8 + 16)\nSpeed 40 ft.\nSTR DEX CON INT WIS CHA\n16 (+3) 12 (+1) 15 (+2) 6 (–2) 13 (+1) 7 (–2)\nSkills Athletics +5\nSenses darkvision 60 ft.';
    const abilities = parseAbilitiesWTC(actorText.split('\n'));
    expect(abilities.str.value).toBe(16);
  });

  it('should get key array and value array', () => {
    const actorText =
      'Big Bara\nMedium humanoid (warforged), neutral evil\nArmor Class 18 (natural armor, Imposing Majesty)\nHit Points 117 (18d8 + 36)\nSpeed 30 ft.\nSTR\n DEX\n CON\n INT\n WIS\n CHA\n14 (+2)\n 17 (+3)\n 15 (+2)\n 13 (+1)\n 16 (+3)\n 18 (+4)\nSaving Throws Con +6, Wis +7\nSkills Perception +7, Survival +7\nDamage Immunities poison\nCondition Immunities charmed, frightened, poisoned\nSenses darkvision 60 ft., passive Perception 17\nLanguages Common\nChallenge 9 (5,000 XP)\nImposing Majesty. Big Bara adds her Charisma bonus to her AC\n(included above).\nWarforged Resilience. Big Bara is immune to disease and magic\ncan’t put her to sleep.\nActions\nMultiattack. Big Bara makes two attacks, either with her\nshortsword or armbow.\nShortsword. Melee Weapon Attack: +7 to hit, reach 5 ft., one\ntarget. Hit: 6 (1d6 + 3) piercing damage plus 13 (3d8) poi-\nson damage.\nArmbow. Ranged Weapon Attack: +7 to hit, range 30/120 ft.,\none target. Hit: 10 (2d6 +3) piercing damage plus 13 (3d8) poi-\nson damage.\nPoisonous Cloud (2/Day). Poison gas fills a 20-foot-radius\nsphere centered on a point Big Bara can see within 50 feet of\nher. The gas spreads around corners and remains until the start\nof Big Bara’s next turn. Each creature that starts its turn in the\ngas must succeed on a DC 16 Constitution saving throw or be\npoisoned for 1 minute. A creature can repeat the saving throw\nat the end of each of its turns, ending the effect on itself on\na success.';
    const lines = actorText.split('\n');
    const { keys, values } = getVerticalKeyValueAbilities(lines);
    expect(keys).toEqual(['str', 'dex', 'con', 'int', 'wis', 'cha']);
    expect(values).toEqual(['14 (+2)', '17 (+3)', '15 (+2)', '13 (+1)', '16 (+3)', '18 (+4)']);
  });

  it('should parse big bara abilities', () => {
    const actorText =
      'Big Bara\nMedium humanoid (warforged), neutral evil\nArmor Class 18 (natural armor, Imposing Majesty)\nHit Points 117 (18d8 + 36)\nSpeed 30 ft.\nSTR\n DEX\n CON\n INT\n WIS\n CHA\n14 (+2)\n 17 (+3)\n 15 (+2)\n 13 (+1)\n 16 (+3)\n 18 (+4)\nSaving Throws Con +6, Wis +7\nSkills Perception +7, Survival +7\nDamage Immunities poison\nCondition Immunities charmed, frightened, poisoned\nSenses darkvision 60 ft., passive Perception 17\nLanguages Common\nChallenge 9 (5,000 XP)\nImposing Majesty. Big Bara adds her Charisma bonus to her AC\n(included above).\nWarforged Resilience. Big Bara is immune to disease and magic\ncan’t put her to sleep.\nActions\nMultiattack. Big Bara makes two attacks, either with her\nshortsword or armbow.\nShortsword. Melee Weapon Attack: +7 to hit, reach 5 ft., one\ntarget. Hit: 6 (1d6 + 3) piercing damage plus 13 (3d8) poi-\nson damage.\nArmbow. Ranged Weapon Attack: +7 to hit, range 30/120 ft.,\none target. Hit: 10 (2d6 +3) piercing damage plus 13 (3d8) poi-\nson damage.\nPoisonous Cloud (2/Day). Poison gas fills a 20-foot-radius\nsphere centered on a point Big Bara can see within 50 feet of\nher. The gas spreads around corners and remains until the start\nof Big Bara’s next turn. Each creature that starts its turn in the\ngas must succeed on a DC 16 Constitution saving throw or be\npoisoned for 1 minute. A creature can repeat the saving throw\nat the end of each of its turns, ending the effect on itself on\na success.';
    const abilities = tryStatParsers(actorText.split('\n'));
    expect(abilities.str.value).toBe(14);
    expect(abilities.str.mod).toBe(2);
  });

  it('should parse abilities of a spythronar sac', () => {
    const actorText =
      'Spythronar Sac\nTiny aberration, unaligned\nArmor Class 5\nHit Points 1 (1d4 – 1)\nSpeed 0 ft.\nSTR DEX CON INT WIS CHA\n1 (–5) 1 (–5) 8 (–1) 1 (–5) 3 (–4) 1 (–5)\nCondition Immunities blinded, charmed, deafened,\nexhaustion, frightened, paralyzed, petrified, poisoned,\nprone, restrained, unconscious\nSenses tremorsense 10 ft. (blind beyond this radius),\npassive Perception 6\nLanguages —\nChallenge 0 (10 XP) Proficiency Bonus +2\nFalse Appearance. The spythronar sac appears to be\na tangled ball of string, twigs, and dirt. Someone who\ncan see the sac can identify it with a successful DC 15\nIntelligence (Arcana or Nature) check.\nFragile. A creature who enters the spythronar sac’s\nspace must succeed on a DC 10 Dexterity saving throw,\nor the sac is destroyed.\nLightning Release. When the spythronar sac is\ndestroyed, it releases lightning in a 10-foot radius. A\ncreature who destroyed the sac by entering its space\nreceives no saving throw. Other creatures in that area\nmust succeed on a DC 10 Dexterity saving throw or\ntake 4 (1d8) lightning damage. Each spythronar swarm\nand web in this area instead gains advantage on its\nnext attack roll.\nShocking Birth. When a spythronar sac takes lightning\ndamage from a source other than another spythronar,\nit hatches, transforming into a spythronar swarm with\nhalf the normal hit points. This swarm rolls initiative and\nenters the combat.';
    const abilities = tryStatParsers(actorText.split('\n'));
    expect(abilities).toStrictEqual({
      str: { value: 1, mod: -5, savingThrow: 0 },
      dex: { value: 1, mod: -5, savingThrow: 0 },
      con: { value: 8, mod: -1, savingThrow: 0 },
      int: { value: 1, mod: -5, savingThrow: 0 },
      wis: { value: 3, mod: -4, savingThrow: 0 },
      cha: { value: 1, mod: -5, savingThrow: 0 },
    });
  });
});

describe('Parse Skills', () => {
  it('should parse a valid skill string', () => {
    const actorText =
      'Swashbuckler\nMedium humanoid (any race), any non-lawful alignment\n\nArmor Class 17 (leather armor)\nHit Points 66 (12d8 + 12)\nSpeed 30 ft.\n\n   STR        DEX         CON        INT        WIS         CHA\n  12 (+1)    18 (+4)     12 (+1)    14 (+2)    11 (+0)     15 (+2)\n\nSkills Acrobatics +8, Athletics +5, Persuasion +6\nSenses passive Perception 10\nLanguages any one language (usually Common)\nChallenge 3 (700 XP)\n\nLightfooted. The swashbuckler can take the Dash or Disengage\naction as a bonus action on each of its turns.\n\nSuave Defense. While the swashbuckler is wearing light or no\narmor and wielding no shield, its AC includes its Charisma\nmod.\n\nActions\n\nMultiattack. The swashbuckler makes three attacks: one with\na dagger and two with its rapier.\nDagger. Melee or Ranged Weapon Attack: +6 to hit, reach 5\nft. or range 20/60 ft., one target. Hit: 6 (1d4 + 4) piercing\ndamage.\nRapier. Melee Weapon Attack: +6 to hit, reach 5 ft., one target.\nHit: 8 (1d8 + 4) piercing damage.';
    const skills = parseSkillsWTC(actorText.split('\n'));
    expect(skills).toEqual([
      { name: 'acrobatics', bonus: 8 },
      { name: 'athletics', bonus: 5 },
      { name: 'persuasion', bonus: 6 },
    ]);
  });
});

describe('getFeatureNames', () => {
  it('should properly split Suave Defense', () => {
    const line = 'Suave Defense. While the swashbuckler is wearing light or no';
    const name = getFeatureNames(line);
    expect(name).toEqual('Suave Defense');
  });
});

describe('findFirstActionIndex', () => {
  it('should return the first action index', () => {
    const actorText =
      'Swashbuckler\nMedium humanoid (any race), any non-lawful alignment\n\nArmor Class 17 (leather armor)\nHit Points 66 (12d8 + 12)\nSpeed 30 ft.\n\n   STR        DEX         CON        INT        WIS         CHA\n  12 (+1)    18 (+4)     12 (+1)    14 (+2)    11 (+0)     15 (+2)\n\nSkills Acrobatics +8, Athletics +5, Persuasion +6\nSenses passive Perception 10\nLanguages any one language (usually Common)\nChallenge 3 (700 XP)\n\nLightfooted. The swashbuckler can take the Dash or Disengage\naction as a bonus action on each of its turns.\n\nSuave Defense. While the swashbuckler is wearing light or no\narmor and wielding no shield, its AC includes its Charisma\nmod.\n\nActions\n\nMultiattack. The swashbuckler makes three attacks: one with\na dagger and two with its rapier.\nDagger. Melee or Ranged Weapon Attack: +6 to hit, reach 5\nft. or range 20/60 ft., one target. Hit: 6 (1d4 + 4) piercing\ndamage.\nRapier. Melee Weapon Attack: +6 to hit, reach 5 ft., one target.\nHit: 8 (1d8 + 4) piercing damage.';
    const featureSplit = actorText.split('\n\n');
    const index = findFirstSectionIndex(featureSplit, 'actions');
    expect(featureSplit[index]).toContain('Multiattack');
  });
});

describe('parseStandardCSV', () => {
  it('should parse condition immunities', () => {
    const actorText =
      'Nimblewright                                                   \n     Medium construct, unaligned                                      \n\n     Armor Class 18 (natural armor)                                   \n     Hit Points 45 (6d8 + 18)                                         \n     Speed 60 ft.                                                     \n\n        STR        DEX        CON          INT       WIS        CHA   \n       12 (+1)    18 (+4)    17 (+3)      8 (-1)    10 (+0)     6 (-2)\n\n     Saving Throws Dex +6                                             \n     Skills Acrobatics +8, Perception +2                              \n     Damage Resistances bludgeoning, piercing and slashing from       \n     nonmagical effects\n     Condition Immunities exhaustion, frightened, petrified, poisoned \n     Senses darkvision 60 ft., passive Perception 12                  \n     Languages understands one language known to its creator but      \n     can’t speak\n     Challenge 4 (1,100 XP)                                           \n                                                                      \n     Magic Resistance. The nimblewright has advantage on saving       \n     throws against spells and other magical effects.\n                                                                      \n     Magic Weapons. The nimblewright’s weapon attacks are             \n     magical.\n                                                                      \n     Repairable. As long as it has at least 1 hit point remaining, the\n     nimblewright regains 1 hit point when a mending spell is cast    \n     on it.\n                                                                      \n     Sure Footed. The nimblewright has advantage on Strength and      \n     Dexterity saving throws made against effects that would knock\n     it prone.                                                        \n                                                                      \n     Actions                                                          \n                                                                      \n     Multiattack. The nimblewright makes three attacks: two with      \n     its rapier and one with its dagger..                             \n     Rapier. Melee Weapon Attack: +6 to hit, reach 5 ft., one target. \n     Hit: 8 (1d8 + 4) piercing damage.                                \n                                                                      \n     Dagger. Melee or Ranged Weapon Attack: +6 to hit, reach 5ft. or\n                                                                      \n     range 20/60 ft., one target. Hit: 6 (1d4 + 4) piercing damage.\n                                                                      \n     Reactions\n     Parry. The nimblewright adds 2 to its AC against one melee\n     attack that would hit it. To do so, the nimblewright must see\n     the attacker and be wielding a melee weapon.';
    const immunities = parseStandardCSV(actorText.split('\n'), 'condition immunities');
    expect(immunities.collection).toEqual(['exhaustion', 'frightened', 'petrified', 'poisoned']);
  });
});

describe('getSenses', () => {
  it('should parse darkvision from a bara', () => {
    const actorText =
      'Big Bara\nMedium humanoid (warforged), neutral evil\nArmor Class 18 (natural armor, Imposing Majesty)\nHit Points 117 (18d8 + 36)\nSpeed 30 ft.\nSTR\n DEX\n CON\n INT\n WIS\n CHA\n14 (+2)\n 17 (+3)\n 15 (+2)\n 13 (+1)\n 16 (+3)\n 18 (+4)\nSaving Throws Con +6, Wis +7\nSkills Perception +7, Survival +7\nDamage Immunities poison\nCondition Immunities charmed, frightened, poisoned\nSenses darkvision 60 ft., passive Perception 17\nLanguages Common\nChallenge 9 (5,000 XP)\nImposing Majesty. Big Bara adds her Charisma bonus to her AC\n(included above).\nWarforged Resilience. Big Bara is immune to disease and magic\ncan’t put her to sleep.\nActions\nMultiattack. Big Bara makes two attacks, either with her\nshortsword or armbow.\nShortsword. Melee Weapon Attack: +7 to hit, reach 5 ft., one\ntarget. Hit: 6 (1d6 + 3) piercing damage plus 13 (3d8) poi-\nson damage.\nArmbow. Ranged Weapon Attack: +7 to hit, range 30/120 ft.,\none target. Hit: 10 (2d6 +3) piercing damage plus 13 (3d8) poi-\nson damage.\nPoisonous Cloud (2/Day). Poison gas fills a 20-foot-radius\nsphere centered on a point Big Bara can see within 50 feet of\nher. The gas spreads around corners and remains until the start\nof Big Bara’s next turn. Each creature that starts its turn in the\ngas must succeed on a DC 16 Constitution saving throw or be\npoisoned for 1 minute. A creature can repeat the saving throw\nat the end of each of its turns, ending the effect on itself on\na success.';
    const lines = actorText.split('\n');
    const senses = parseSensesWTC(lines);
    expect(senses.darkvision).toEqual(60);
  });
});

describe('Parse Text', () => {
  it('should parse the text into an actor', () => {
    const actorText =
      'Swashbuckler\nMedium humanoid (any race), any non-lawful alignment\n\nArmor Class 17 (leather armor)\nHit Points 66 (12d8 + 12)\nSpeed 30 ft.\n\n   STR        DEX         CON        INT        WIS         CHA\n  12 (+1)    18 (+4)     12 (+1)    14 (+2)    11 (+0)     15 (+2)\n\nSkills Acrobatics +8, Athletics +5, Persuasion +6\nSenses passive Perception 10\nLanguages any one language (usually Common)\nChallenge 3 (700 XP)\n\nLightfooted. The swashbuckler can take the Dash or Disengage\naction as a bonus action on each of its turns.\n\nSuave Defense. While the swashbuckler is wearing light or no\narmor and wielding no shield, its AC includes its Charisma\nmod.\n\nActions\n\nMultiattack. The swashbuckler makes three attacks: one with\na dagger and two with its rapier.\nDagger. Melee or Ranged Weapon Attack: +6 to hit, reach 5\nft. or range 20/60 ft., one target. Hit: 6 (1d4 + 4) piercing\ndamage.\nRapier. Melee Weapon Attack: +6 to hit, reach 5 ft., one target.\nHit: 8 (1d8 + 4) piercing damage.';
    const actor = textToActor(actorText);
    expect(actor.name).toBe('Swashbuckler');
    expect(actor.biography).toBe('Medium humanoid (any race), any non-lawful alignment');
    expect(actor.health.value).toEqual(66);
    expect(actor.health.min).toEqual(12 + 12);
    expect(actor.health.max).toEqual(12 * 8 + 12);
    expect(actor.armorClass.value).toEqual(17);
    expect(actor.armorClass.type).toBe('leather armor');
    expect(actor.speed).toEqual(30);
    expect(actor.skills.length).toEqual(3);
    expect(actor.items[0].description).toBe(
      'The swashbuckler can take the Dash or Disengage action as a bonus action on each of its turns.',
    );
    expect(actor.items.length).toEqual(5);
  });

  it('should parse a nimblewright into an actor', () => {
    const actorText =
      'Nimblewright                                                   \n     Medium construct, unaligned                                      \n\n     Armor Class 18 (natural armor)                                   \n     Hit Points 45 (6d8 + 18)                                         \n     Speed 60 ft.                                                     \n\n        STR        DEX        CON          INT       WIS        CHA   \n       12 (+1)    18 (+4)    17 (+3)      8 (-1)    10 (+0)     6 (-2)\n\n     Saving Throws Dex +6                                             \n     Skills Acrobatics +8, Perception +2                              \n     Damage Resistances bludgeoning, piercing and slashing from       \n     nonmagical effects\n     Condition Immunities exhaustion, frightened, petrified, poisoned \n     Senses darkvision 60 ft., passive Perception 12                  \n     Languages understands one language known to its creator but      \n     can’t speak\n     Challenge 4 (1,100 XP)                                           \n                                                                      \n     Magic Resistance. The nimblewright has advantage on saving       \n     throws against spells and other magical effects.\n                                                                      \n     Magic Weapons. The nimblewright’s weapon attacks are             \n     magical.\n                                                                      \n     Repairable. As long as it has at least 1 hit point remaining, the\n     nimblewright regains 1 hit point when a mending spell is cast    \n     on it.\n                                                                      \n     Sure Footed. The nimblewright has advantage on Strength and      \n     Dexterity saving throws made against effects that would knock\n     it prone.                                                        \n                                                                      \n     Actions                                                          \n                                                                      \n     Multiattack. The nimblewright makes three attacks: two with      \n     its rapier and one with its dagger..                             \n     Rapier. Melee Weapon Attack: +6 to hit, reach 5 ft., one target. \n     Hit: 8 (1d8 + 4) piercing damage.                                \n                                                                      \n     Dagger. Melee or Ranged Weapon Attack: +6 to hit, reach 5ft. or\n                                                                      \n     range 20/60 ft., one target. Hit: 6 (1d4 + 4) piercing damage.\n                                                                      \n     Reactions\n     Parry. The nimblewright adds 2 to its AC against one melee\n     attack that would hit it. To do so, the nimblewright must see\n     the attacker and be wielding a melee weapon.';
    const actor = textToActor(actorText);
    expect(actor.name).toBe('Nimblewright');
    expect(actor.type).toBe('construct');
    expect(actor.health.value).toEqual(45);
    expect(actor.health.min).toEqual(6 + 18);
    expect(actor.health.max).toEqual(6 * 8 + 18);
    expect(actor.armorClass.value).toEqual(18);
    expect(actor.armorClass.type).toBe('natural armor');
    expect(actor.speed).toEqual(60);
    expect(actor.skills.length).toEqual(2);
    expect(actor.items.length).toEqual(8);
    expect(actor.items[0].name).toBe('Magic Resistance');
    expect(actor.items[0].description).toBe(
      'The nimblewright has advantage on saving throws against spells and other magical effects.',
    );
  });

  it('should parse swashbuckler when copied with zathura', () => {
    const actorText =
      'Swashbuckler\nArmor Class 17 (leather armor)\nHit Points 66 (12d8 + 12)\nSpeed 30 ft. Armor Class 12 (15 with mage armor)\nHit Points 78 (12d8 + 24)\nSpeed 30 ft.\nMedium humanoid (any race), any non-lawful alignment\nSTR\n12 (+1)\nDEX\n18 (+4)\nCON\n12 (+1)\nINT\n14 (+2)\nWIS\n11 (+0)\nCHA\n15 (+2)\nSkills Acrobatics +8, Athletics +5, Persuasion +6\nSenses passive Perception 10\nLanguages any one language (usually Common)\nChallenge 3 (700 XP)\nLightfooted. The swashbuckler can take the Dash or Disengage\naction as a bonus action on each of its turns.\nSuave Defense. While the swashbuckler is wearing light or no\narmor and wielding no shield, its AC includes its Charisma\nmodifier.\nActions\nMultiattack. The swashbuckler makes three attacks: one with\na dagger and two with its rapier.\nDagger. Melee or Ranged Weapon Attack: +6 to hit, reach 5\nft. or range 20/60 ft., one target. Hit: 6 (1d4 + 4) piercing\ndamage.\nRapier. Melee Weapon Attack: +6 to hit, reach 5 ft., one target.\nHit: 8 (1d8 + 4) piercing damage.';

    const actor = textToActor(actorText);
    expect(actor.name).toBe('Swashbuckler');
    expect(actor.biography).toBe('Medium humanoid (any race), any non-lawful alignment');
    expect(actor.health.value).toEqual(66);
    expect(actor.health.min).toEqual(12 + 12);
    expect(actor.health.max).toEqual(12 * 8 + 12);
    expect(actor.armorClass.value).toEqual(17);
    expect(actor.armorClass.type).toBe('leather armor');
    expect(actor.speed).toEqual(30);
    expect(actor?.rating).toBeDefined();
    expect(actor?.rating?.cr).toBeDefined();
    expect(actor?.rating?.xp).toBeDefined();
    expect(actor?.rating?.cr).toEqual(3);
    expect(actor?.rating?.xp).toEqual(700);
    expect(actor.skills.length).toEqual(3);
    expect(actor.items.length).toEqual(5);
    expect(actor.items[0].description).toBe(
      'The swashbuckler can take the Dash or Disengage action as a bonus action on each of its turns.',
    );
  });

  it('should parse big bara', () => {
    const actorText =
      'Big Bara\nMedium humanoid (warforged), neutral evil\nArmor Class 18 (natural armor, Imposing Majesty)\nHit Points 117 (18d8 + 36)\nSpeed 30 ft.\nSTR\n DEX\n CON\n INT\n WIS\n CHA\n14 (+2)\n 17 (+3)\n 15 (+2)\n 13 (+1)\n 16 (+3)\n 18 (+4)\nSaving Throws Con +6, Wis +7\nSkills Perception +7, Survival +7\nDamage Immunities poison\nCondition Immunities charmed, frightened, poisoned\nSenses darkvision 60 ft., passive Perception 17\nLanguages Common\nChallenge 9 (5,000 XP)\nImposing Majesty. Big Bara adds her Charisma bonus to her AC\n(included above).\nWarforged Resilience. Big Bara is immune to disease and magic\ncan’t put her to sleep.\nActions\nMultiattack. Big Bara makes two attacks, either with her\nshortsword or armbow.\nShortsword. Melee Weapon Attack: +7 to hit, reach 5 ft., one\ntarget. Hit: 6 (1d6 + 3) piercing damage plus 13 (3d8) poi-\nson damage.\nArmbow. Ranged Weapon Attack: +7 to hit, range 30/120 ft.,\none target. Hit: 10 (2d6 +3) piercing damage plus 13 (3d8) poi-\nson damage.\nPoisonous Cloud (2/Day). Poison gas fills a 20-foot-radius\nsphere centered on a point Big Bara can see within 50 feet of\nher. The gas spreads around corners and remains until the start\nof Big Bara’s next turn. Each creature that starts its turn in the\ngas must succeed on a DC 16 Constitution saving throw or be\npoisoned for 1 minute. A creature can repeat the saving throw\nat the end of each of its turns, ending the effect on itself on\na success.';
    const actor = textToActor(actorText);
    expect(actor.name).toBe('Big Bara');
    expect(actor.alignment).toBe('Neutral Evil');
    expect(actor.languages).toEqual(['common']);
    expect(actor.abilities.con?.savingThrow).toEqual(4);
    expect(actor.abilities.wis?.savingThrow).toEqual(4);
    expect(actor.type).toEqual('humanoid');
    expect(actor.size).toBe('Medium');
    expect(actor.health.value).toEqual(117);
    expect(actor.abilities.str.value).toEqual(14);
    expect(actor.abilities.str.mod).toEqual(2);
    expect(actor.damageImmunities).toEqual(['poison']);
    expect(actor.conditionImmunities).toEqual(['charmed', 'frightened', 'poisoned']);
    expect(actor.damageVulnerabilities).toEqual([]);
    expect(actor.senses.darkvision).toEqual(60);
    expect(actor.items).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'Poisonous Cloud (2/Day)' })]));
    const sword = actor.items.find((f) => f.name === 'Shortsword');
    expect(sword).toBeDefined();
    expect(sword?.description).toBe(
      'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage plus 13 (3d8) poison damage.',
    );
  });

  it('should parse sphythronar sac', () => {
    // test for issue https://github.com/EthanJWright/foundryvtt-importer/issues/25
    const actorText =
      'Spythronar Sac\nTiny aberration, unaligned\nArmor Class 5\nHit Points 1 (1d4 – 1)\nSpeed 0 ft.\nSTR DEX CON INT WIS CHA\n1 (–5) 1 (–5) 8 (–1) 1 (–5) 3 (–4) 1 (–5)\nCondition Immunities blinded, charmed, deafened,\nexhaustion, frightened, paralyzed, petrified, poisoned,\nprone, restrained, unconscious\nSenses tremorsense 10 ft. (blind beyond this radius),\npassive Perception 6\nLanguages —\nChallenge 0 (10 XP) Proficiency Bonus +2\nFalse Appearance. The spythronar sac appears to be\na tangled ball of string, twigs, and dirt. Someone who\ncan see the sac can identify it with a successful DC 15\nIntelligence (Arcana or Nature) check.\nFragile. A creature who enters the spythronar sac’s\nspace must succeed on a DC 10 Dexterity saving throw,\nor the sac is destroyed.\nLightning Release. When the spythronar sac is\ndestroyed, it releases lightning in a 10-foot radius. A\ncreature who destroyed the sac by entering its space\nreceives no saving throw. Other creatures in that area\nmust succeed on a DC 10 Dexterity saving throw or\ntake 4 (1d8) lightning damage. Each spythronar swarm\nand web in this area instead gains advantage on its\nnext attack roll.\nShocking Birth. When a spythronar sac takes lightning\ndamage from a source other than another spythronar,\nit hatches, transforming into a spythronar swarm with\nhalf the normal hit points. This swarm rolls initiative and\nenters the combat.';
    const actor = textToActor(actorText);
    expect(actor.name).toBe('Spythronar Sac');
    expect(actor.senses.tremorsense).toEqual(10);
    expect(actor.senses.special).toEqual('blind beyond this radius');
    expect(actor.abilities).toStrictEqual({
      str: { value: 1, mod: -5, savingThrow: 0 },
      dex: { value: 1, mod: -5, savingThrow: 0 },
      con: { value: 8, mod: -1, savingThrow: 0 },
      int: { value: 1, mod: -5, savingThrow: 0 },
      wis: { value: 3, mod: -4, savingThrow: 0 },
      cha: { value: 1, mod: -5, savingThrow: 0 },
    });
    expect(actor.conditionImmunities).toEqual([
      'blinded',
      'charmed',
      'deafened',
      'exhaustion',
      'frightened',
      'paralyzed',
      'petrified',
      'poisoned',
      'prone',
      'restrained',
      'unconscious',
    ]);
  });
});

describe('parseMultiLineStates', () => {
  it('should parse abilities originating from a multi line file', () => {
    const actorText =
      'Swashbuckler\nArmor Class 17 (leather armor)\nHit Points 66 (12d8 + 12)\nSpeed 30 ft. Armor Class 12 (15 with mage armor)\nHit Points 78 (12d8 + 24)\nSpeed 30 ft.\nMedium humanoid (any race), any non-lawful alignment\nSTR\n12 (+1)\nDEX\n18 (+4)\nCON\n12 (+1)\nINT\n14 (+2)\nWIS\n11 (+0)\nMedium humanoid (any race), any alignment\nCHA\n15 (+2)\nSkills Acrobatics +8, Athletics +5, Persuasion +6\nSenses passive Perception 10\nLanguages any one language (usually Common)\nChallenge 3 (700 XP)\nLightfooted. The swashbuckler can take the Dash or Disengage\naction as a bonus action on each of its turns.\nSuave Defense. While the swashbuckler is wearing light or no\narmor and wielding no shield, its AC includes its Charisma\nmodifier.\nActions\nMultiattack. The swashbuckler makes three attacks: one with\na dagger and two with its rapier.\nDagger. Melee or Ranged Weapon Attack: +6 to hit, reach 5\nft. or range 20/60 ft., one target. Hit: 6 (1d4 + 4) piercing\ndamage.\nRapier. Melee Weapon Attack: +6 to hit, reach 5 ft., one target.\nHit: 8 (1d8 + 4) piercing damage.';
    const lines: string[] = actorText.split('\n');
    const abilities = parseMultilineAbilitiesWTC(lines);
    expect(abilities).toEqual({
      str: {
        value: 12,
        mod: 1,
        savingThrow: 0,
      },
      dex: {
        value: 18,
        mod: 4,
        savingThrow: 0,
      },
      con: {
        value: 12,
        mod: 1,
        savingThrow: 0,
      },
      int: {
        value: 14,
        mod: 2,
        savingThrow: 0,
      },
      wis: {
        value: 11,
        mod: 0,
        savingThrow: 0,
      },
      cha: {
        value: 15,
        mod: 2,
        savingThrow: 0,
      },
    });
  });
});

describe('getAllFeatures', () => {
  it('should get a swashbucklers features', () => {
    const actorText =
      'Swashbuckler\nArmor Class 17 (leather armor)\nHit Points 66 (12d8 + 12)\nSpeed 30 ft. Armor Class 12 (15 with mage armor)\nHit Points 78 (12d8 + 24)\nSpeed 30 ft.\nMedium humanoid (any race), any non-lawful alignment\nSTR\n12 (+1)\nDEX\n18 (+4)\nCON\n12 (+1)\nINT\n14 (+2)\nWIS\n11 (+0)\nCHA\n15 (+2)\nSkills Acrobatics +8, Athletics +5, Persuasion +6\nSenses passive Perception 10\nLanguages any one language (usually Common)\nChallenge 3 (700 XP)\nLightfooted. The swashbuckler can take the Dash or Disengage\naction as a bonus action on each of its turns.\nSuave Defense. While the swashbuckler is wearing light or no\narmor and wielding no shield, its AC includes its Charisma\nmodifier.\nActions\nMultiattack. The swashbuckler makes three attacks: one with\na dagger and two with its rapier.\nDagger. Melee or Ranged Weapon Attack: +6 to hit, reach 5\nft. or range 20/60 ft., one target. Hit: 6 (1d4 + 4) piercing\ndamage.\nRapier. Melee Weapon Attack: +6 to hit, reach 5 ft., one target.\nHit: 8 (1d8 + 4) piercing damage.';
    const features = parseFeaturesWTC(actorText.split('\n'));
    expect(features.length).toEqual(5);
  });

  it('should get all features for an adventure league monster', () => {
    const actorText =
      'Big Bara\nMedium humanoid (warforged), neutral evil\nArmor Class 18 (natural armor, Imposing Majesty)\nHit Points 117 (18d8 + 36)\nSpeed 30 ft.\nSTR\n DEX\n CON\n INT\n WIS\n CHA\n14 (+2)\n 17 (+3)\n 15 (+2)\n 13 (+1)\n 16 (+3)\n 18 (+4)\nSaving Throws Con +6, Wis +7\nSkills Perception +7, Survival +7\nDamage Immunities poison\nCondition Immunities charmed, frightened, poisoned\nSenses darkvision 60 ft., passive Perception 17\nLanguages Common\nChallenge 9 (5,000 XP)\nImposing Majesty. Big Bara adds her Charisma bonus to her AC\n(included above).\nWarforged Resilience. Big Bara is immune to disease and magic\ncan’t put her to sleep.\nActions\nMultiattack. Big Bara makes two attacks, either with her\nshortsword or armbow.\nShortsword. Melee Weapon Attack: +7 to hit, reach 5 ft., one\ntarget. Hit: 6 (1d6 + 3) piercing damage plus 13 (3d8) poi-\nson damage.\nArmbow. Ranged Weapon Attack: +7 to hit, range 30/120 ft.,\none target. Hit: 10 (2d6 +3) piercing damage plus 13 (3d8) poi-\nson damage.\nPoisonous Cloud (2/Day). Poison gas fills a 20-foot-radius\nsphere centered on a point Big Bara can see within 50 feet of\nher. The gas spreads around corners and remains until the start\nof Big Bara’s next turn. Each creature that starts its turn in the\ngas must succeed on a DC 16 Constitution saving throw or be\npoisoned for 1 minute. A creature can repeat the saving throw\nat the end of each of its turns, ending the effect on itself on\na success.';
    const features = parseFeaturesWTC(actorText.split('\n'));
    expect(features).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'Poisonous Cloud (2/Day)' })]));
  });
});

describe('getChallenge', () => {
  it('should get a challenge rating that is a fraction', () => {
    const input = 'Challenge 1/8 (25 XP))';
    const rating = parseRatingWTC([input]);
    expect(rating).toEqual({ cr: 0.125, xp: 25 });
  });
});
