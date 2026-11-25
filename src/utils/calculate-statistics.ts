import type { Flashcard } from '../types/flashcards';

export interface VocabularyStatistics {
  totalCount: number;
  learnedCount: number;
  progressPercent: number;
}

export function calculateStatistics(
  cards: readonly Flashcard[]
): VocabularyStatistics {
  const totalCount = cards.length;
  const learnedCount = cards.reduce(
    (count, card) => count + (card.learned ? 1 : 0),
    0
  );
  const progressPercent =
    totalCount === 0 ? 0 : (learnedCount / totalCount) * 100;

  return { totalCount, learnedCount, progressPercent };
}
