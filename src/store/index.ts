import { LocalStorageFlashcardStore } from './local-storage-flashcard-store';

// Создаём один общий экземпляр хранилища карточек.
export const flashcardStore = new LocalStorageFlashcardStore();
