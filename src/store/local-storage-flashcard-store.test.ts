// Импортируем функции для создания тестов и управления их окружением.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LocalStorageFlashcardStore } from './local-storage-flashcard-store';
// Импортируем стартовые карточки для проверки первого запуска.
import { seedWords } from '../data/seed-words';

describe('LocalStorageFlashcardStore', () => {
  const storage = new Map<string, string>();

  const localStorageMock = {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),

    setItem: vi.fn((key: string, value: string) => {
      storage.set(key, value);
    }),
  };

  // Создаём чистое тестовое хранилище перед каждым тестом,
  // чтобы результаты тестов не зависели друг от друга.
  beforeEach(() => {
    storage.clear();
    vi.clearAllMocks();
    vi.stubGlobal('localStorage', localStorageMock);
  });

  // Восстанавливаем глобальные переменные после каждого теста.
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // Проверяем, что карточки восстанавливаются из localStorage.
  it('should restore saved cards from localStorage', () => {
    // Создаём тестовую карточку.
    const savedCard = {
      id: '1',
      word: 'apple',
      translation: 'яблоко',
      learned: false,
    };

    // Заранее сохраняем массив карточек в тестовое хранилище.
    storage.set('wordflow-cards', JSON.stringify([savedCard]));

    // Создаём объект, конструктор которого читает localStorage.
    const store = new LocalStorageFlashcardStore();

    // Проверяем, что восстановленная карточка совпадает с сохранённой.
    expect(store.getCards()).toEqual([savedCard]);
  });

  // Проверяем загрузку стартовых карточек при первом запуске приложения.
  it('should load seed words when localStorage is empty', () => {
    // Создаём хранилище без предварительно сохранённых данных.
    const store = new LocalStorageFlashcardStore();

    // Проверяем, что в памяти появились все стартовые карточки.
    expect(store.getCards()).toEqual(seedWords);

    // Проверяем, что стартовые карточки сохранились в localStorage.
    expect(localStorage.getItem('wordflow-cards')).toBe(
      JSON.stringify(seedWords)
    );
  });

  // Проверяем, что сохранённый пустой массив не заменяется стартовыми карточками.
  it('should restore an empty array from localStorage', () => {
    // Имитируем ситуацию, когда пользователь удалил все карточки.
    storage.set('wordflow-cards', JSON.stringify([]));

    // Создаём объект, который восстановит данные из localStorage.
    const store = new LocalStorageFlashcardStore();

    // Проверяем, что массив карточек остался пустым.
    expect(store.getCards()).toEqual([]);

    // Проверяем, что сохранённые данные не были перезаписаны.
    expect(localStorage.getItem('wordflow-cards')).toBe('[]');
  });

  // Проверяем, что повреждённый JSON не приводит к падению приложения.
  it('should handle invalid JSON without crashing', () => {
    // Сохраняем некорректную JSON-строку.
    storage.set('wordflow-cards', '{ invalid json }');

    // Проверяем, что создание объекта не выбрасывает исключение.
    expect(() => new LocalStorageFlashcardStore()).not.toThrow();

    // Создаём объект для проверки восстановленных карточек.
    const store = new LocalStorageFlashcardStore();

    // Проверяем, что вместо повреждённых данных загружены стартовые карточки.
    expect(store.getCards()).toEqual(seedWords);
  });

  // Проверяем, что массив объектов без полей Flashcard отклоняется.
  it('should load seed words when stored cards have invalid structure', () => {
    storage.set('wordflow-cards', '[{}]');

    const store = new LocalStorageFlashcardStore();

    expect(store.getCards()).toEqual(seedWords);
  });

  // Проверяем, что перед тестом хранилище не содержит данных.
  it('should start with an empty test storage', () => {
    // Проверяем отсутствие ранее сохранённых карточек.
    expect(localStorage.getItem('wordflow-cards')).toBeNull();
  });
});
