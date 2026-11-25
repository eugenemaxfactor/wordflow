import { describe, expect, it } from 'vitest';
import type { Flashcard } from '../types/flashcards';
import { calculateStatistics } from './calculate-statistics';

function makeCard(id: string, learned: boolean): Flashcard {
  return { id, word: 'apple', translation: 'яблоко', learned };
}

describe('calculateStatistics', () => {
  it('returns zero counts and zero percent for an empty vocabulary', () => {
    expect(calculateStatistics([])).toEqual({
      totalCount: 0,
      learnedCount: 0,
      progressPercent: 0,
    });
  });

  it('counts learned cards and keeps fractional progress for a mixed vocabulary', () => {
    const cards = [
      makeCard('1', true),
      makeCard('2', false),
      makeCard('3', false),
    ];

    const statistics = calculateStatistics(cards);

    expect(statistics.totalCount).toBe(3);
    expect(statistics.learnedCount).toBe(1);
    expect(statistics.progressPercent).toBeCloseTo(100 / 3);
  });

  it('returns zero percent when no cards are learned', () => {
    expect(calculateStatistics([makeCard('1', false)])).toEqual({
      totalCount: 1,
      learnedCount: 0,
      progressPercent: 0,
    });
  });

  it('returns 100 percent when all cards are learned', () => {
    expect(
      calculateStatistics([makeCard('1', true), makeCard('2', true)])
    ).toEqual({
      totalCount: 2,
      learnedCount: 2,
      progressPercent: 100,
    });
  });

  it('does not mutate the input array or its cards', () => {
    const cards = [makeCard('1', false), makeCard('2', true)];
    const original = structuredClone(cards);
    cards.forEach((card) => Object.freeze(card));
    Object.freeze(cards);

    calculateStatistics(cards);

    expect(cards).toEqual(original);
  });
});
