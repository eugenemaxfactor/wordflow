import { describe, expect, it } from 'vitest';
import type { Flashcard } from '../types/flashcards';
import { filterFlashcards } from './filter-flashcards';

const cards: Flashcard[] = [
  {
    id: '1',
    word: 'Apple',
    translation: 'Яблоко',
    learned: false,
  },
  {
    id: '2',
    word: 'Application',
    translation: 'Приложение',
    learned: true,
  },
  {
    id: '3',
    word: 'Book',
    translation: 'Книга',
    learned: false,
  },
];

describe('filterFlashcards', () => {
  it('finds a card by its full English word', () => {
    const result = filterFlashcards(cards, 'Apple');

    expect(result).toEqual([cards[0]]);
  });

  it('finds cards by a partial English word', () => {
    // Arrange
    const query = 'app';

    // Act
    const result = filterFlashcards(cards, query);

    // Assert
    expect(result).toEqual([cards[0], cards[1]]);
  });

  it('finds a card by its translation', () => {
    const query = 'Книга';

    const result = filterFlashcards(cards, query);

    expect(result).toEqual([cards[2]]);
  });

  it('finds cards regardless of letter case', () => {
    const query = 'aPpLe';

    const result = filterFlashcards(cards, query);

    expect(result).toEqual([cards[0]]);
  });

  it('returns all cards when the query is empty', () => {
    const query = '';

    const result = filterFlashcards(cards, query);

    expect(result).toEqual(cards);
  });

  it('returns an empty array when no cards match the query', () => {
    const query = 'banana';

    const result = filterFlashcards(cards, query);

    expect(result).toEqual([]);
  });

  it('ignores leading and trailing whitespace in the query', () => {
    const query = '  Apple  ';

    const result = filterFlashcards(cards, query);

    expect(result).toEqual([cards[0]]);
  });

  it('does not mutate the original cards', () => {
    const originalCards = structuredClone(cards);

    filterFlashcards(cards, 'app');

    expect(cards).toEqual(originalCards);
  });
});
