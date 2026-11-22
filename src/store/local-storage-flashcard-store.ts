import type { Flashcard } from '../types/flashcards';
import { MemoryFlashcardStore } from './flashcard-store';
import { seedWords } from '../data/seed-words';
import { isFlashcard } from '../utils/flashcard-type-guard';

export class LocalStorageFlashcardStore extends MemoryFlashcardStore {
  private readonly storageKey = 'wordflow-cards';

  constructor() {
    super();

    const savedData = localStorage.getItem(this.storageKey);

    let cards: Flashcard[];

    if (savedData !== null) {
      try {
        const parsed: unknown = JSON.parse(savedData);

        if (Array.isArray(parsed) && parsed.every(isFlashcard)) {
          cards = parsed;
        } else {
          cards = seedWords;
        }
      } catch {
        cards = seedWords;
      }
    } else {
      cards = seedWords;
    }

    cards.forEach((card) => {
      super.addCard(card);
    });

    if (savedData === null) {
      this.saveCards();
    }
  }

  private saveCards(): void {
    const cards = this.getCards();

    const json = JSON.stringify(cards);

    localStorage.setItem(this.storageKey, json);
  }

  override addCard(card: Flashcard): void {
    super.addCard(card);

    this.saveCards();
  }

  override updateCard(id: string, changes: Partial<Flashcard>): void {
    super.updateCard(id, changes);

    this.saveCards();
  }

  override deleteCard(id: string): void {
    super.deleteCard(id);

    this.saveCards();
  }
}
