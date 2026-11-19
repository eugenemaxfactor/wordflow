import { describe, it, expect } from 'vitest';
import { sum } from './math';

describe('sum', () => {
  it('должна правильно складывать два числа', () => {
    const result = sum(2, 3);

    expect(result).toBe(5);
  });
});