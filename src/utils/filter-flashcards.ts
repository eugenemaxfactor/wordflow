import type { Flashcard } from '../types/flashcards';

export function filterFlashcards(
  cards: readonly Flashcard[],
  query: string
): Flashcard[] {
  const normalizedQuery = query.trim().toLowerCase();

  function matchesQuery(card: Flashcard): boolean {
    const cardWord = card.word.trim().toLowerCase();
    const cardTranslation = card.translation.trim().toLowerCase();

    const result =
      cardWord.includes(normalizedQuery) ||
      cardTranslation.includes(normalizedQuery);

    return result;
  }

  return cards.filter(matchesQuery);
}
