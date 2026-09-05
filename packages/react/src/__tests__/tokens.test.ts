import { describe, it, expect } from 'vitest';
import { tokens, HARD_BANS, MAX_DATA_WEIGHT } from '../tokens';

describe('design tokens', () => {
  it('uses warm paper, not pure white', () => {
    expect(tokens.paper).not.toBe('#ffffff');
    expect(tokens.paper).toBe('#f6f5f2');
  });

  it('uses warm ink, not pure black', () => {
    expect(tokens.ink).not.toBe('#000000');
    expect(tokens.ink).toBe('#191712');
  });

  it('caps data font weight at 600', () => {
    expect(MAX_DATA_WEIGHT).toBe(600);
  });

  it('exposes a closed trunk palette of 8 (NYCTA heritage)', () => {
    expect(Object.keys(tokens.trunk)).toHaveLength(8);
  });

  it('has a single Move color (red) and a single Law color (blue)', () => {
    expect(tokens.red).toBeDefined();
    expect(tokens.blue).toBeDefined();
  });
});

describe('hard bans', () => {
  it('bans all common rounded Tailwind classes', () => {
    expect(HARD_BANS.tailwind).toContain('rounded-md');
    expect(HARD_BANS.tailwind).toContain('rounded-lg');
    expect(HARD_BANS.tailwind).toContain('rounded-2xl');
    expect(HARD_BANS.tailwind).toContain('rounded-full');
  });

  it('bans all common shadow Tailwind classes', () => {
    expect(HARD_BANS.tailwind).toContain('shadow-md');
    expect(HARD_BANS.tailwind).toContain('shadow-lg');
    expect(HARD_BANS.tailwind).toContain('shadow-xl');
  });

  it('bans all common gradient and blur classes', () => {
    expect(HARD_BANS.tailwind).toContain('bg-gradient-to-');
    expect(HARD_BANS.tailwind.some((c) => c.startsWith('blur-'))).toBe(true);
    expect(HARD_BANS.tailwind.some((c) => c.startsWith('backdrop-blur-'))).toBe(true);
  });

  it('bans emoji-grade color utility classes', () => {
    expect(HARD_BANS.colors.some((c) => c.startsWith('text-red-'))).toBe(true);
    expect(HARD_BANS.colors.some((c) => c.startsWith('bg-emerald-'))).toBe(true);
  });

  it('bans heavy font weights on data', () => {
    expect(HARD_BANS.type).toContain('font-bold');
    expect(HARD_BANS.type).toContain('font-weight: 700');
  });
});
