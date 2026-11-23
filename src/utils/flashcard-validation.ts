import type { Flashcard } from '../types/flashcards';

// Проверяет, существует ли английское слово в словаре.
export function isDuplicateWord(cards: Flashcard[], word: string): boolean {
  const normalizedWord = word.trim().toLowerCase();

  return cards.some((card) => {
    return card.word.trim().toLowerCase() === normalizedWord;
  });
}

// Проверяет, что слово и перевод содержат непустой текст.
export function hasValidCardFields(word: string, translation: string): boolean {
  return word.trim().length > 0 && translation.trim().length > 0;
}
