import type { Flashcard } from '../types/flashcards';

/**
 * Формирует очередь карточек для учебной сессии.
 * Не изменяет исходный массив.
 */
export function prepareLearningQueue(cards: Flashcard[]): Flashcard[] {
  // Храним ID карточек, уже добавленных в очередь.
  const seenIds = new Set<string>();

  const filteredCards = cards.filter((card) => {
    // Пропускаем изученные карточки.
    if (card.learned === true) {
      return false;
    }

    // Пропускаем карточки с повторяющимся ID.
    if (seenIds.has(card.id)) {
      return false;
    }

    // Запоминаем ID и добавляем карточку в очередь.
    seenIds.add(card.id);
    return true;
  });

  return filteredCards;
}
