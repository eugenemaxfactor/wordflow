import type { Flashcard } from './flashcards';

export interface FlashcardStore {
  getCards(): Flashcard[];

  addCard(card: Flashcard): void;

  updateCard(id: string, changes: Partial<Flashcard>): void;

  deleteCard(id: string): void;
}