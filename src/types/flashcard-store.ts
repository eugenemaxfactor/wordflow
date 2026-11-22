import type { Flashcard } from './flashcards';

export interface FlashcardStore {
  getCards(): Flashcard[];

  addCard(card: Flashcard): void;

  updateCard(id: string, changes: Partial<Omit<Flashcard, 'id'>>): void;

  deleteCard(id: string): void;
}
