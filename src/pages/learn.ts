import type { FlashcardStore } from '../types/flashcard-store';
import type { Flashcard } from '../types/flashcards';
import { escapeHtml } from '../utils/escape-html';
import { prepareLearningQueue } from '../utils/prepare-learning-queue';

type LearnView =
  | { kind: 'card'; card: Flashcard; position: number; total: number }
  | { kind: 'complete'; total: number }
  | { kind: 'empty-vocabulary' }
  | { kind: 'all-learned' };

function renderLearnContent(view: LearnView): string {
  switch (view.kind) {
    case 'card': {
      const { card, position, total } = view;
      return `
            <p>Card ${position} of ${total}</p>
            <article class="learn-card">
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
            <button type="button" class="nav-button" data-learn-i-know hidden disabled>I Know</button>
            <button type="button" class="nav-button" data-learn-again hidden disabled>Again</button>`;
    }
    case 'complete':
      return `
        <p>Session complete. Reviewed ${view.total} of ${view.total} cards.</p>
        <button type="button" class="nav-button" data-learn-restart>Start New Session</button>`;
    case 'empty-vocabulary':
      return `
        <p>Your vocabulary is empty. Add a word to start learning.</p>
        <button type="button" class="nav-button" data-learn-vocabulary>Go to Vocabulary</button>`;
    case 'all-learned':
      return '<p>All cards are learned.</p>';
  }
}

export function renderLearnPage(view: LearnView): string {
  return `
    <section class="learn" aria-labelledby="learn-title">
      <h2 id="learn-title" tabindex="-1">Learn</h2>
      ${renderLearnContent(view)}
    </section>
  `;
}

export function mountLearnPage(
  container: HTMLElement,
  store: FlashcardStore,
  openVocabulary: () => void
): void {
  let queue: Flashcard[] = [];
  let currentIndex = 0;

  function startSession(): void {
    const cards = store.getCards();
    queue = prepareLearningQueue(cards);
    currentIndex = 0;

    if (queue.length > 0) {
      renderCurrentCard();
      return;
    }

    container.innerHTML = renderLearnPage({
      kind: cards.length === 0 ? 'empty-vocabulary' : 'all-learned',
    });
    container
      .querySelector('[data-learn-vocabulary]')
      ?.addEventListener('click', openVocabulary);
  }

  function renderCurrentCard(): void {
    const card = queue[currentIndex];

    if (!card) {
      container.innerHTML = renderLearnPage({
        kind: 'complete',
        total: queue.length,
      });
      container
        .querySelector('[data-learn-restart]')
        ?.addEventListener('click', () => {
          startSession();
          container.querySelector<HTMLElement>('#learn-title')?.focus();
        });
      return;
    }

    container.innerHTML = renderLearnPage({
      kind: 'card',
      card,
      position: currentIndex + 1,
      total: queue.length,
    });

    const answer = container.querySelector<HTMLElement>('#learn-answer');
    const showAnswer = container.querySelector<HTMLButtonElement>(
      '[data-learn-show-answer]'
    );

    const iKnow = container.querySelector<HTMLButtonElement>(
      '[data-learn-i-know]'
    );

    const again =
      container.querySelector<HTMLButtonElement>('[data-learn-again]');

    if (!answer || !showAnswer || !iKnow || !again) {
      return;
    }

    showAnswer.addEventListener('click', () => {
      answer.hidden = false;
      showAnswer.setAttribute('aria-expanded', 'true');
      iKnow.hidden = false;
      iKnow.disabled = false;
      again.hidden = false;
      again.disabled = false;
    });

    function rateCard(cardId: string, learned: boolean): void {
      if (answer.hidden) {
        return;
      }

      store.updateCard(cardId, { learned });
      currentIndex += 1;
      renderCurrentCard();
      container.querySelector<HTMLElement>('#learn-title')?.focus();
    }

    iKnow.addEventListener('click', () => rateCard(card.id, true));
    again.addEventListener('click', () => rateCard(card.id, false));
  }

  startSession();
}
