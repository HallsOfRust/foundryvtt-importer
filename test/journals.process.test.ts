import { buildStructure, guessDepth, isUpOne, parseToJournal } from '../src/module/journal/process';

describe('guessDepth', () => {
  it('should return the depth of the journal', () => {
    const journalText =
      'Dragon Heist – Campaign Overview\nReference Timeline\nRISE AND FALL OF LORD NEVEREMBER\n    • 1451 DR: Neverwinter is destroyed when a small adventuring party (including Jarlaxle Baenre) awoke the primordial Maegera beneath Mount Hotenow.\n    • 1467 DR: Lord Dagult Neverember, Open Lord of Waterdeep, proclaims himself ruler of Neverwinter and begins the New Neverwinter movement to rebuild the city.\n    • Lord Neverember begins embezzling money from the Waterdeep treasury.\n    • Lord Neverember discovers the Stone of Golorr in Neverwinter.\n    • When Lady Alethea Brandath (Lord Neverember’s wife) dies, Lord Neverember learns of the existence of an ancient dwarven vault beneath the Brandath Mausoleum.\n    • Lord Neverember gains access to the old Melairkyn Vault beneath the Brandath Mausoleum. He begins storing the embezzled money (eventually totaling half a million gold dragons) in the Vault and uses the Stone of Golorr to hide its existence.\n    • As an additional security precaution, Lord Neverember blinds the Stone of Golorr: Leaving the Stone in Waterdeep Palace, he keeps one of the Eyes with him in Neverwinter, secretly gives one to his son (hidden inside a mourning locket), and hides the last within the Brandath Mausoleum.\n    • During this time, various factions become aware that Lord Neverember is engaged in some grand scheme, of which only the contours are known. The phrase “Neverember’s Enigma” is coined.\n    • 1489 DR: Laeral Silverhand returns to Waterdeep and Lord Neverember is deposed.\n    • In the confusion of the transition of power, Lord Neverember sends agents to retrieve the Stone of Golorr from the palace. As those agents leave the city, they are ambushed by Xanatharian agents who steal the Stone.\n\nTHE GRAND GAME\n    • The Cassalanters retrieve what they believe to be Neverember’s Enigma — but is actually just one of the Eyes — from the Brandath Mausoleum. Their research quickly reveals that it is part of the Stone of Golorr.\n    • Lord Neverember sends a network of agents into Waterdeep. Many of these agents are attempting to locate the Stone. One of them, Dalakhar, is assigned to keep a watchful eye on Dagult’s son, Renaer. (Dalakhar isn’t told this, but Lord Neverember’s primary concern is that the Eye unwittingly carried by Renaer is kept safe until he can regain the Stone.)\n    • Manshoonian Zhentarim steal the Eye from the Protector’s Enclave in Neverwinter.\n    • Laeral Silverhand’s auditors discover Lord Neverember’s embezzlement. The news soon leaks.\n    • Zhentarim go to Xanathar to propose an alliance. Xanathar kills the embassy and takes their Eye. A gang war breaks out between the Guild and the Black Network.\n    • Lord Neverember discovers that Xanathar stole the Stone. Dalakhar is sent to infiltrate Xanathar’s organization and steal the Stone back. (At this point Lord Neverember believes that Xanathar has the Stone and that the Zhentarim still have the Eye they stole from him. To maintain the original siloing of information, Dalakhar is not told about the Eyes and doesn’t know to look for the one Xanathar now holds.)\n    • Jarlaxle Baenre arrives in Waterdeep and begins selling nimblewrights.\n    • 1492 DR: Today.\n\nDRAGON HEIST BEGINS (1492 DR)\n    • Ches 1st: With Dalakhar’s network removed from watching over Renaer, he’s exposed. The Zhentarim kidnap Renaer and take the Eye hidden in his mourning locket. (The PCs then presumably rescue Renaer.)\n    • Ches 20th: Dalakhar successfully steals the Stone from Xanathar.\n    • Ches 22nd: Dalakhar’s attempts to leave town are unsuccessful. (Xanathar tracked down and killed his extraction team before he could rendezvous with them, and he has agents surrounding Renaer Neverember’s house.) Dalakhar attempts to meet Renaer at Trollskull Manor, but by this time he’s being actively tracked by the Gralhund, Zhentarim, Cassalanters, and possibly others. Dalakhar is killed by the Gralhund Nimblewright. (See Part 2 and Part 5C.)\nFleetswake & Waukeentide\n(Ches 21st thu 30th & Tarsakh 1st thru 10th)\nFLEETSWAKE: This festival is the beginning of the Spring Social Season in Waterdeep. Celebrating the sea, maritime trade, and the gods of the sea, navigation, and weather, it spans the last tenday of Ches, and includes a series of boat races and guild-sponsored galas at the Copper Cup festhall. According to custom, the winners of the various competitions don’t keep their trophies and earnings, but deliver them to the priests of Umberlee at the Queenspire, her temple on the beach by the east entrance to the Great Harbor, at the conclusion of the festival (see below).\n    • Ches 21 – Selûne Sashelas: A celebration of Selûne, goddess of the moon and navigation, and Deep Sashelas of the Seldarine, elven god of the sea. It is supposedly based on a mangled legend dating back to the time when the elven city of Aelinthaldaar stood where Waterdeep does today and telling of a time when the elves of the sea said farewell to their brethren upon the land and moved into the deep ocean. The elves largely declare this to be a bunch of hogwash, but nevertheless the “historical event” is commemorated by the Twin Parades: A huge line of ships (varying greatly in size) proceeds from the harbor, loops up the coast, and returns. Simultaneously, a land-based parade proceeds from the Docks and through the streets of Waterdeep.\n    • Ches 25 – Shipwrights’ Ball: Held at the Shipwrights’ House, what was once a guild celebration has turned into one of the biggest social events of Fleetswake.\n    • Ches 29-30 - Fair Seas Festival: Much feasting on seafood, the harbor is strewn with flower petals, and the City Guards go from tavern to tavern to collect offerings for Umberlee. Collection boxes also appear at large festival gatherings. Upon sunset of the final day, the collected coin is placed in chests and dumped into the deepest part of the harbor. (See Dragon Heist, p. 185 for anyone who thinks they should try to loot it.)\n    • Ches 30 – Highcoin Balls: When Lord Peirgeiron was High Lord of Waterdeep, he threw the Highcoin Ball on the 30th of Ches which would last all through the last day of the Fair Seas Festival. It was considered the absolute necessity for those intending to be on the scene that season, and those who missed it became an afterthought for the rest of the year. After Lord Peirgeion’s passing, a number of noble families tried to pick up the tradition. The result are the Highcoin Balls, which now generally begin after sundown (when the ceremonies of Umberlee’s Cache take place). It’s not unusual for guests to wander from one party to the next.\n\nWAUKEENTIDE: This festival has long gathered a number of older holidays under one name, stretching those celebrations and rituals into a holiday season that lasts a tenday in homage to Waukeen, the goddess of wealth and trade.fs\n    • Tarsahk 1 – Caravance: This gift-giving holiday commemorates the traditional arrival of the first caravans of the season into the city. Many parents hide gifts for their offspring in their homes, telling the children that they were left by Old Carvas – a mythical peddler who arrived with the first caravan to reach Waterdeep, his wagon loaded down with toys for children to enjoy.\n    • Tarsahk 5 – Goldenight: This festival celebrates coin and gold, with many businesses staying open all night, offering midnight sales and other promotions. Some celebrants and customers decorate themselves with gold dust and wear coins as jewelry.\n    • Tarsahk 7 – Guildsmeet: On this holiday, guild members gather in their halls for the announcement of new policies and a celebration of business concluded for the year. These gatherings culminate in a gala festival and dance sponsored by several guilds, which lasts from dusk till dawn and overruns the Market, the Cynosure, the Field of Triumph, and all areas in between.\n    • Tarsahk 10 – Leiruin: In times long past, Waukeen caught Leira, the goddess of illusions and deception, attempting to cheat her in a deal, and buried her under a mountain of molten gold as punishment. A commemoration of that event, Leiruin is the day for guild members to pay their annual dues and for guildmasters to meet with the Lords of Waterdeep and renew their charters for another year. In the evening, the Leiruin Feasts are held, in which gold coins (and other golden treasures) are baked into random items of food to be won by those who are lucky enough to receive them.';
    expect(guessDepth(journalText)).toBe(3);
  });

  it('should build a simple journal', () => {
    const journalText =
      'Main Title\nSection One\nFirst Note\nLorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    const structure = buildStructure(journalText);
    expect(structure).toEqual({
      name: 'Main Title',
      entries: [],
      subfolders: [
        {
          name: 'Section One',
          subfolders: [],
          entries: [
            {
              name: 'First Note',
              content:
                'Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            },
          ],
        },
      ],
    });
  });
});

describe('Find location tests', () => {
  it('should locate a note that is up one', () => {
    const journalText =
      'Second Note\nHello world this is a note to test whether a second note can be collected properly we shall see.';
    expect(isUpOne(journalText.split('\n'), 0)).toBe(true);
  });
});

describe('parseToJournal', () => {
  it('should parse lorem ipsum', () => {
    const journalText =
      'Main Title\nSection One\nFirst Note\nLorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\nSecond Note\nHello world this is a note to test whether a second note can be collected properly we shall see.\nSection Two\nFirst Note\nTest another chunk of text lets see if it can handle this, who knows. This is a note too though.';
    const journal = parseToJournal(journalText);
    expect(journal.value).toBe('Main Title');
    expect(journal.children[0].value).toBe('Section One');
    expect(journal.children[1].value).toBe('Section Two');
    expect(journal.children.length).toBe(2);
    expect(journal.children[0].children[0].value).toBe('First Note');
    expect(journal.children[0].children[0].notes[0].value).toBe(
      'Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
    );
    expect(journal.children[0].children[0].notes[1].value).toBe(
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
    );
    expect(journal.children[0].children[0].notes[2].value).toBe(
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    );
    expect(journal.children[0].children[1].value).toBe('Second Note');
    expect(journal.children[1].children[0].value).toBe('First Note');
    expect(journal.children[0].children.length).toBe(2);
  });
});
