import { describe, it, expect } from 'vitest';
import { MemoryFlashcardStore } from './flashcard-store';

describe('MemoryFlashcardStore', () => {
  it('должен добавлять новую карточку', () => {
    // Создаём экземпляр хранилища
    const store = new MemoryFlashcardStore();

    // Создаём карточку
    const card = {
      id: '1',
      word: 'apple',
      translation: 'яблоко',
      learned: false,
    };

    // Добавляем карточку
    store.addCard(card);

    // Получаем все карточки
    const cards = store.getCards();

    // Проверяем результат
    expect(cards).toHaveLength(1);
    expect(cards[0]).toEqual(card);
  });

  it('должен обновлять существующую карточку', () => {
    const store = new MemoryFlashcardStore();

    const card = {
      id: '1',
      word: 'apple',
      translation: 'яблоко',
      learned: false,
    };

    // Добавляем карточку
    store.addCard(card);

    // Обновляем карточку
    store.updateCard('1', { learned: true });

    // Получаем обновлённую карточку
    const updatedCard = store.getCards()[0];

    // Проверяем результат
    expect(updatedCard.learned).toBe(true);
    expect(updatedCard.word).toBe('apple');
    expect(updatedCard.translation).toBe('яблоко');
  });

  it('должен удалять карточку по id', () => {
    const store = new MemoryFlashcardStore();

    const card1 = {
      id: '1',
      word: 'apple',
      translation: 'яблоко',
      learned: false,
    };

    const card2 = {
      id: '2',
      word: 'house',
      translation: 'дом',
      learned: false,
    };

    // Добавляем две карточки
    store.addCard(card1);
    store.addCard(card2);

    // Удаляем первую карточку
    store.deleteCard('1');

    // Получаем оставшиеся карточки
    const cards = store.getCards();

    // Проверяем результат
    expect(cards).toHaveLength(1);
    expect(cards[0]).toEqual(card2);
  });

  it('не должен позволять изменять внутренний массив', () => {
    const store = new MemoryFlashcardStore();

    const card = {
      id: '1',
      word: 'apple',
      translation: 'яблоко',
      learned: false,
    };

    store.addCard(card);

    // Получаем массив карточек
    const cards = store.getCards();

    // Изменяем полученный массив
    cards.pop();

    // Проверяем внутреннее хранилище
    expect(store.getCards()).toHaveLength(1);
  });

  it('не должен позволять изменять карточки напрямую', () => {
    const store = new MemoryFlashcardStore();

    const card = {
      id: '1',
      word: 'apple',
      translation: 'яблоко',
      learned: false,
    };

    store.addCard(card);

    // Получаем карточки
    const cards = store.getCards();

    // Изменяем объект в полученном массиве
    cards[0].learned = true;

    // Проверяем, что оригинальная карточка не изменилась
    expect(store.getCards()[0].learned).toBe(false);
  });

  it('не должен изменять карточку при изменении исходного объекта', () => {
    const store = new MemoryFlashcardStore();

    const card = {
      id: '1',
      word: 'apple',
      translation: 'яблоко',
      learned: false,
    };

    store.addCard(card);

    // Изменяем исходный объект
    card.learned = true;

    // Проверяем карточку внутри хранилища
    const storedCard = store.getCards()[0];

    expect(storedCard.learned).toBe(false);
  });

  it('should preserve card id when updating', () => {
    const store = new MemoryFlashcardStore();
    // Создаём карточку
    store.addCard({
      id: '123',
      word: 'apple',
      translation: 'яблоко',
      learned: false,
    });

    const changes = {
      id: '999',
      learned: true,
    };
    // Пытаемся изменить её идентификатор
    store.updateCard('123', changes);

    // Получаем обновлённую карточку
    const cards = store.getCards();
    // Проверяем результат
    expect(cards[0].id).toBe('123');
    expect(cards[0].learned).toBe(true);
  });
});
