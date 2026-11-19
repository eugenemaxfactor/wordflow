import type { Flashcard } from '../types/flashcards';
import type { FlashcardStore } from '../types/flashcard-store';

export class MemoryFlashcardStore implements FlashcardStore {
  private cards: Flashcard[] = [];

    getCards(): Flashcard[] {
    return this.cards.map((card) => {
        return { ...card };
    });
    }

    addCard(card: Flashcard): void {
    this.cards.push({ ...card });
    }

  updateCard(
    id: string, 
    changes: Partial<Omit<Flashcard, 'id'>>
): void {
    const update = function(card: Flashcard) {
        return card.id === id ? { ...card, ...changes } : card
    }

    this.cards = this.cards.map(update);
  }

  deleteCard(id: string): void {
    this.cards = this.cards.filter((card) => card.id !== id);
  }
}