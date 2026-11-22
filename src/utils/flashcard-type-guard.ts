import type { Flashcard } from '../types/flashcards';

// Проверяет, соответствует ли неизвестное значение структуре Flashcard.
export function isFlashcard(value: unknown): value is Flashcard {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const card = value as Record<string, unknown>;

  return (
    typeof card.id === 'string' &&
    typeof card.word === 'string' &&
    typeof card.translation === 'string' &&
    typeof card.learned === 'boolean'
  );
}
