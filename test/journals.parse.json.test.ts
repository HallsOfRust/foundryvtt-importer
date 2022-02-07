import { Note, notesToHTMLNote } from '../src/module/journal/parse.json';

describe('notesToHTMLNote', () => {
  it('should convert a two notes to a single html block', () => {
    const notes: Note[] = [
      {
        value: 'this is the first part of the note',
        tag: 'p',
      },
      {
        value: 'this is the second part of the note',
        tag: 'p',
      },
    ];
    const parsed = notesToHTMLNote(notes);
    expect(parsed).toEqual('<p>this is the first part of the note</p><p>this is the second part of the note</p>');
  });

  it('should convert an unordered list', () => {
    const notes: Note[] = [
      {
        value: 'ordered list below',
        tag: 'p',
      },
      {
        value: '• 1451 DR',
        tag: 'lu',
      },
      {
        value: '• 1462 DR',
        tag: 'lu',
      },
    ];
    const parsed = notesToHTMLNote(notes);
    expect(parsed).toEqual('<p>ordered list below</p><ul><li>1451 DR</lu></li></ul><ul><li>1462 DR</lu></li></ul>');
  });
});
