import { describe, it, expect, vi, afterEach } from 'vitest';
import { LocalStorageFlashcardStore } from './local-storage-flashcard-store';
import { seedWords } from '../data/seed-words';

describe('LocalStorageFlashcardStore', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads seed words when stored cards are invalid', () => {
    // Имитируем браузерный localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue('[{}]'),
      setItem: vi.fn(),
    });

    // Создаём хранилище, которое загрузит данные
    const store = new LocalStorageFlashcardStore();

    // Проверяем, что загрузился стартовый словарь
    expect(store.getCards()).toEqual(seedWords);
  });

  it('keeps an empty array when no cards are saved', () => {
    // Имитируем localStorage с сохранённым пустым массивом
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue('[]'),
      setItem: vi.fn(),
    });

    // Создаём хранилище
    const store = new LocalStorageFlashcardStore();

    // Проверяем, что массив карточек остался пустым
    expect(store.getCards()).toEqual([]);
  });

  it('preserves the card id after updating and reloading', () => {
    let savedData = JSON.stringify([
      {
        id: '123',
        word: 'apple',
        translation: 'яблоко',
        learned: false,
      },
    ]);

    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => savedData),
      setItem: vi.fn((_key: string, value: string) => {
        savedData = value;
      }),
    });

    const store = new LocalStorageFlashcardStore();
    const changes = { id: '999', learned: true };

    store.updateCard('123', changes);

    expect(JSON.parse(savedData)).toEqual([
      {
        id: '123',
        word: 'apple',
        translation: 'яблоко',
        learned: true,
      },
    ]);

    const reloadedStore = new LocalStorageFlashcardStore();

    expect(reloadedStore.getCards()[0].id).toBe('123');
    expect(reloadedStore.getCards()[0].learned).toBe(true);
  });
});
