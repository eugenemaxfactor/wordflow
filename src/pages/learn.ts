import type { Flashcard } from '../types/flashcards';
import { escapeHtml } from '../utils/escape-html';
import { prepareLearningQueue } from '../utils/prepare-learning-queue';

export function renderLearnPage(
  card: Flashcard | undefined,
  hasNext: boolean
): string {
  return `
    <section class="learn" aria-labelledby="learn-title">
      <h2 id="learn-title">Learn</h2>
      ${
        card
          ? `<article class="learn-card">
              <h3 class="learn-card__word">${escapeHtml(card.word)}</h3>
              <p class="learn-card__answer" hidden>${escapeHtml(card.translation)}</p>
            </article>`
          : '<p>No new cards to learn.</p>'
      }
      ${hasNext ? '<button type="button" class="nav-button" data-learn-next>Next Card</button>' : ''}
    </section>
  `;
}

export function mountLearnPage(
  container: HTMLElement,
  cards: Flashcard[]
): void {
  const queue = prepareLearningQueue(cards);
  let currentIndex = 0;

  function render(): void {
    const hasNext = currentIndex + 1 < queue.length;
    // Рендер новой карточки всегда начинается со скрытого перевода.
    container.innerHTML = renderLearnPage(queue[currentIndex], hasNext);

    container
      .querySelector('[data-learn-next]')
      ?.addEventListener('click', () => {
        currentIndex += 1;
        render();
      });
  }

  render();
}
