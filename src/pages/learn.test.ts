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
    const html = renderLearnPage(card, true);

    expect(html).toContain('<h3 class="learn-card__word">apple</h3>');
    expect(html).toContain(
      '<p id="learn-answer" class="learn-card__answer" hidden>яблоко</p>'
    );
    expect(html).toContain('Show Answer');
    expect(html).toContain('aria-controls="learn-answer"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('Next Card');
  });

  it('does not offer a next card when the current card is the last one', () => {
    expect(renderLearnPage(card, false)).not.toContain('Next Card');
  });

  it('shows an empty state when no cards are available', () => {
    const html = renderLearnPage(undefined, false);

    expect(html).toContain('No new cards to learn.');
    expect(html).not.toContain('<article');
    expect(html).not.toContain('Show Answer');
  });
});
