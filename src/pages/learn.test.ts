import { describe, expect, it } from 'vitest';
import { renderLearnPage } from './learn';

const card = {
  id: '1',
  word: 'apple',
  translation: 'яблоко',
  learned: false,
};

describe('renderLearnPage', () => {
  it('shows the current word and hides its translation', () => {
    const html = renderLearnPage({ kind: 'card', card, position: 2, total: 3 });

    expect(html).toContain('Card 2 of 3');
    expect(html).toContain('<h3 class="learn-card__word">apple</h3>');
    expect(html).toContain(
      '<p id="learn-answer" class="learn-card__answer" hidden>яблоко</p>'
    );
    expect(html).toContain('Show Answer');
    expect(html).toContain('aria-controls="learn-answer"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('data-learn-i-know hidden disabled>I Know');
    expect(html).toContain('data-learn-again hidden disabled>Again');
  });

  it('shows completed progress and a restart action', () => {
    const html = renderLearnPage({ kind: 'complete', total: 2 });

    expect(html).toContain('Session complete. Reviewed 2 of 2 cards.');
    expect(html).toContain('Start New Session');
    expect(html).not.toContain('I Know');
  });

  it('offers a Vocabulary shortcut when the dictionary is empty', () => {
    const html = renderLearnPage({ kind: 'empty-vocabulary' });

    expect(html).toContain('Your vocabulary is empty.');
    expect(html).toContain('Go to Vocabulary');
    expect(html).not.toContain('<article');
    expect(html).not.toContain('Show Answer');
  });

  it('distinguishes an empty dictionary from a fully learned one', () => {
    const html = renderLearnPage({ kind: 'all-learned' });

    expect(html).toContain('All cards are learned.');
    expect(html).not.toContain('Your vocabulary is empty.');
  });
});
