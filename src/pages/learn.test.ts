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
    const html = renderLearnPage(card);

    expect(html).toContain('<h3 class="learn-card__word">apple</h3>');
    expect(html).toContain(
      '<p id="learn-answer" class="learn-card__answer" hidden>яблоко</p>'
    );
    expect(html).toContain('Show Answer');
    expect(html).toContain('aria-controls="learn-answer"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('data-learn-i-know hidden disabled>I Know');
  });

  it('shows the end of the session after the last card is marked learned', () => {
    const html = renderLearnPage(undefined, true);

    expect(html).toContain('Session complete.');
    expect(html).not.toContain('I Know');
  });

  it('shows an empty state when no cards are available', () => {
    const html = renderLearnPage(undefined, false);

    expect(html).toContain('No new cards to learn.');
    expect(html).not.toContain('<article');
    expect(html).not.toContain('Show Answer');
  });
});
