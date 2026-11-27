import type { Flashcard } from '../types/flashcards';
import { calculateStatistics } from '../utils/calculate-statistics';

export function renderStatisticsPage(cards: readonly Flashcard[]): string {
  const { totalCount, learnedCount, progressPercent } =
    calculateStatistics(cards);

  const formattedProgress = `${progressPercent.toFixed(1)}%`;

  const emptyState =
    totalCount === 0
      ? `
        <div class="statistics-empty">
          <h3>Your vocabulary is empty.</h3>
          <p>Add your first word to start tracking your progress.</p>
        </div>
      `
      : '';

  return `
    <section class="statistics">
      <header class="statistics-header">
        <h2>Statistics</h2>
        <p>Track your vocabulary learning progress.</p>
      </header>

      <div class="statistics-grid">

        <div class="statistics-card">
          <p class="statistics-label">Total cards</p>
          <p class="statistics-value">${totalCount}</p>
        </div>

        <div class="statistics-card">
          <p class="statistics-label">Learned cards</p>
          <p class="statistics-value">${learnedCount}</p>
        </div>

        <div class="statistics-card">
          <p class="statistics-label">Progress</p>
          <p class="statistics-value">${formattedProgress}</p>
        </div>

      </div>

      <div class="statistics-progress-section">
        <div class="statistics-progress-header">
          <h3>Learning progress</h3>
          <span>${formattedProgress}</span>
        </div>

        <progress
          class="statistics-progress"
          value="${progressPercent}"
          max="100"
          aria-label="Learning progress"
        ></progress>

        <p class="statistics-progress-description">
          ${learnedCount} of ${totalCount} cards learned
        </p>
      </div>

      ${emptyState}
    </section>
  `;
}
