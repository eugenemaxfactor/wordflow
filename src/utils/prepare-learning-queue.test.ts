import { describe, it, expect } from 'vitest';
import { prepareLearningQueue } from './prepare-learning-queue';
import type { Flashcard } from '../types/flashcards';

describe('prepareLearningQueue', () => {
  it('should return only unlearned cards', () => {
    // Arrange: подготавливаем тестовые карточки.
    const cards: Flashcard[] = [
      { id: '1', word: 'apple', translation: 'яблоко', learned: false },
      { id: '2', word: 'banana', translation: 'банан', learned: true },
      { id: '3', word: 'orange', translation: 'апельсин', learned: false },
    ];

    // Act: формируем очередь обучения.
    const result = prepareLearningQueue(cards);

    // Assert: проверяем количество и порядок карточек.
    expect(result).toHaveLength(2);
    expect(result.map((card) => card.id)).toEqual(['1', '3']);
  });

  it('should return an empty array when no cards are provided', () => {
    // Arrange: создаём пустой массив карточек.
    const cards: Flashcard[] = [];

    // Act: вызываем функцию подготовки очереди.
    const result = prepareLearningQueue(cards);

    // Assert: проверяем, что результат — пустой массив.
    expect(result).toEqual([]);
  });

  it('should return an empty array when all cards are learned', () => {
    // Arrange: создаём массив полностью изученных карточек.
    const cards: Flashcard[] = [
      { id: '1', word: 'apple', translation: 'яблоко', learned: true },
      { id: '2', word: 'banana', translation: 'банан', learned: true },
      { id: '3', word: 'orange', translation: 'апельсин', learned: true },
    ];

    // Act: формируем очередь обучения.
    const result = prepareLearningQueue(cards);

    // Assert: очередь должна быть пустой.
    expect(result).toEqual([]);
  });

  it('should remove duplicate cards by id', () => {
    // Arrange: создаём карточки с повторяющимися ID.
    const cards: Flashcard[] = [
      { id: '1', word: 'apple', translation: 'яблоко', learned: false },
      { id: '2', word: 'banana', translation: 'банан', learned: false },
      { id: '1', word: 'apple', translation: 'яблоко', learned: false },
      { id: '3', word: 'orange', translation: 'апельсин', learned: false },
    ];

    // Act: формируем очередь обучения.
    const result = prepareLearningQueue(cards);

    // Assert: проверяем, что повторяющиеся ID исключены.
    expect(result.map((card) => card.id)).toEqual(['1', '2', '3']);
  });

  it('should not mutate the original array', () => {
    // Arrange: создаём исходный массив карточек.
    const cards: Flashcard[] = [
      { id: '1', word: 'apple', translation: 'яблоко', learned: false },
      { id: '2', word: 'banana', translation: 'банан', learned: true },
    ];

    // Сохраняем копию исходных данных.
    const originalCards = structuredClone(cards);

    // Act: вызываем тестируемую функцию.
    const result = prepareLearningQueue(cards);

    // Assert: исходный массив остался без изменений.
    expect(cards).toEqual(originalCards);

    // Результат — отдельный массив.
    expect(result).not.toBe(cards);
  });
});
