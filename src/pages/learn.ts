import type { FlashcardStore } from '../types/flashcard-store';
import type { Flashcard } from '../types/flashcards';
import { escapeHtml } from '../utils/escape-html';
import { prepareLearningQueue } from '../utils/prepare-learning-queue';

export function renderLearnPage(
  card: Flashcard | undefined,
  isComplete = false
): string {
  return `
    <section class="learn" aria-labelledby="learn-title">
      <h2 id="learn-title">Learn</h2>
      ${
        card
          ? `<article class="learn-card">
              <h3 class="learn-card__word">${escapeHtml(card.word)}</h3>
              <p id="learn-answer" class="learn-card__answer" hidden>${escapeHtml(card.translation)}</p>
            </article>
            <button
              type="button"
              class="nav-button"
              aria-controls="learn-answer"
              aria-expanded="false"
              data-learn-show-answer
            >Show Answer</button>
            <button type="button" class="nav-button" data-learn-i-know hidden disabled>I Know</button>`
          : isComplete
            ? '<p>Session complete.</p>'
            : '<p>No new cards to learn.</p>'
      }
    </section>
  `;
}

export function mountLearnPage(
  container: HTMLElement,
  store: FlashcardStore
): void {
  const queue = prepareLearningQueue(store.getCards());
  let currentIndex = 0;

  function render(): void {
    const card = queue[currentIndex];
    // Рендер новой карточки всегда начинается со скрытого перевода.
    container.innerHTML = renderLearnPage(card, currentIndex > 0);

    const answer = container.querySelector<HTMLElement>('#learn-answer');
    const showAnswer = container.querySelector<HTMLButtonElement>(
      '[data-learn-show-answer]'
    );

    const iKnow = container.querySelector<HTMLButtonElement>(
      '[data-learn-i-know]'
    );

    if (!card || !answer || !showAnswer || !iKnow) {
      return;
    }

    showAnswer.addEventListener('click', () => {
      answer.hidden = false;
      showAnswer.setAttribute('aria-expanded', 'true');
      iKnow.hidden = false;
      iKnow.disabled = false;
    });

    iKnow.addEventListener('click', () => {
      if (answer.hidden) {
        return;
      }

      store.updateCard(card.id, { learned: true });
      currentIndex += 1;
      render();
    });
  }

  render();
}
