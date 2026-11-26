import { describe, expect, it } from 'vitest';
import type { Flashcard } from '../types/flashcards';
import { renderStatisticsPage } from './statistics';

function makeCard(id: string, learned: boolean): Flashcard {
  return {
    id,
    word: 'apple',
    translation: 'яблоко',
    learned,
  };
}

describe('renderStatisticsPage', () => {
  it('renders statistics for a mixed vocabulary', () => {
    // Arrange — подготавливаем тестовые данные.
    const cards = [
      makeCard('1', true),
      makeCard('2', false),
      makeCard('3', false),
    ];

    // Act — вызываем тестируемую функцию.
    const html = renderStatisticsPage(cards);

    // Assert — проверяем результат.
    expect(html).toContain(
      '<p class="statistics-label">Total cards</p>\n          <p class="statistics-value">3</p>'
    );
    expect(html).toContain(
      '<p class="statistics-label">Learned cards</p>\n          <p class="statistics-value">1</p>'
    );
    expect(html).toContain('33.3%');
  });

  it('renders an empty state when vocabulary is empty', () => {
    // Arrange
    const cards: Flashcard[] = [];

    // Act
    const html = renderStatisticsPage(cards);

    // Assert
    expect(html).toContain('Your vocabulary is empty.');
    expect(html).toContain('0.0%');
  });

  it('does not render an empty state when vocabulary has cards', () => {
    // Arrange
    const cards = [makeCard('1', false)];

    // Act
    const html = renderStatisticsPage(cards);

    // Assert
    expect(html).not.toContain('Your vocabulary is empty.');
  });

  it('renders 100% progress when all cards are learned', () => {
    // Arrange
    const cards = [
      makeCard('1', true),
      makeCard('2', true),
      makeCard('3', true),
    ];

    // Act
    const html = renderStatisticsPage(cards);

    // Assert
    expect(html).toContain('100.0%');
  });

  it('renders progress bar with correct value and max', () => {
    // Arrange
    const cards = [makeCard('1', true), makeCard('2', false)];

    // Act
    const html = renderStatisticsPage(cards);

    // Assert
    expect(html).toContain('<progress');
    expect(html).toContain('value="50"');
    expect(html).toContain('max="100"');
  });

  it('renders updated statistics when card status changes', () => {
    // Arrange
    const cards = [makeCard('1', true), makeCard('2', false)];

    // Act
    const initialHtml = renderStatisticsPage(cards);

    cards[1].learned = true;

    const updatedHtml = renderStatisticsPage(cards);

    // Assert
    expect(initialHtml).toContain('50.0%');
    expect(updatedHtml).toContain('100.0%');
  });
});
