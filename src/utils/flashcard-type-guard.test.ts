import { describe, it, expect } from 'vitest';
import { isFlashcard } from './flashcard-type-guard';

describe('isFlashcard', () => {
  it('returns true for a valid flashcard', () => {
    const card = {
      id: '1',
      word: 'apple',
      translation: 'яблоко',
      learned: false,
    };

    const result = isFlashcard(card);

    expect(result).toBe(true);
  });

  it('returns false for an empty object', () => {
    const card = {};

    const result = isFlashcard(card);

    expect(result).toBe(false);
  });

  it('returns false when learned is a string', () => {
    const card = {
      id: '2',
      word: 'apple',
      translation: 'яблоко',
      learned: 'false',
    };

    const result = isFlashcard(card);

    expect(result).toBe(false);
  });
});
