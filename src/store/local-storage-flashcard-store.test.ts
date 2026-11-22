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
});
