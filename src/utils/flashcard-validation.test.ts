import { describe, expect, it } from 'vitest';
import { isDuplicateWord, hasValidCardFields } from './flashcard-validation';
import type { Flashcard } from '../types/flashcards';

const cards: Flashcard[] = [
  {
    id: '1',
    word: 'Apple',
    translation: 'Яблоко',
    learned: false,
  },
  {
    id: '2',
    word: 'Banana',
    translation: 'Банан',
    learned: false,
  },
];

describe('isDuplicateWord', () => {
  // Проверяем обнаружение существующего слова.
  it('should detect an existing word', () => {
    expect(isDuplicateWord(cards, 'Apple')).toBe(true);
  });

  // Проверяем, что регистр букв не влияет на результат.
  it('should detect duplicates regardless of case', () => {
    expect(isDuplicateWord(cards, 'APPLE')).toBe(true);
    expect(isDuplicateWord(cards, 'apple')).toBe(true);
  });

  // Проверяем, что пробелы по краям игнорируются.
  it('should ignore leading and trailing spaces', () => {
    expect(isDuplicateWord(cards, '  Apple  ')).toBe(true);
  });

  // Проверяем, что новое слово не считается дубликатом.
  it('should return false for a new word', () => {
    expect(isDuplicateWord(cards, 'Orange')).toBe(false);
  });

  // Проверяем поиск дубликатов в пустом словаре.
  it('should return false for an empty vocabulary', () => {
    expect(isDuplicateWord([], 'Apple')).toBe(false);
  });
});

describe('hasValidCardFields', () => {
  // Проверяем корректно заполненные поля.
  it('should accept valid word and translation', () => {
    expect(hasValidCardFields('Apple', 'Яблоко')).toBe(true);
  });

  // Проверяем пустое английское слово.
  it('should reject an empty word', () => {
    expect(hasValidCardFields('', 'Яблоко')).toBe(false);
  });

  // Проверяем пустой перевод.
  it('should reject an empty translation', () => {
    expect(hasValidCardFields('Apple', '')).toBe(false);
  });

  // Проверяем строки, состоящие только из пробелов.
  it('should reject whitespace-only values', () => {
    expect(hasValidCardFields('   ', 'Яблоко')).toBe(false);
    expect(hasValidCardFields('Apple', '   ')).toBe(false);
    expect(hasValidCardFields('   ', '   ')).toBe(false);
  });

  // Проверяем, что пробелы вокруг текста допустимы.
  it('should accept values with surrounding spaces', () => {
    expect(hasValidCardFields('  Apple  ', '  Яблоко  ')).toBe(true);
  });
});
