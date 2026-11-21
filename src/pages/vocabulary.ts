import { flashcardStore } from '../store';
import type { Flashcard } from '../types/flashcards';

// Формирует HTML-разметку страницы Vocabulary.
export function renderVocabularyPage(): string {
  const cards = flashcardStore.getCards();

  // Создаёт HTML для одной карточки.
  function renderCard(card: Flashcard): string {
    const status = card.learned ? 'learned' : 'new';

    return `
      <article class="vocabulary-card">
        <h3 class="vocabulary-card__word">${card.word}</h3>
        <p class="vocabulary-card__translation">${card.translation}</p>
        <span class="vocabulary-card__status vocabulary-card__status--${status}">
          ${status}
        </span>
      </article>
    `;
  }

  const cardItems = cards.map(renderCard).join('');

  return `
    <section class="vocabulary">
      <h2>Vocabulary</h2>
      <p>Total words: ${cards.length}</p>
      ${
        cards.length > 0
          ? `<div class="vocabulary-grid">${cardItems}</div>`
          : '<p>No words yet.</p>'
      }
    </section>
  `;
}
