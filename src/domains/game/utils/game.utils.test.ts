import { describe, it, expect } from 'vitest';
import {
  generateRandomIds,
  generateCharacterIds,
  createCardPair,
  createCards,
  shuffleCards,
  isMatch,
  isSelectable,
} from '../utils/game.utils';
import type { RickMortyCharacter, Card } from '../types/game.types';
import { GAME_CONFIG, RICK_MORTY_API } from '../constants/game.constants';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockCharacter: RickMortyCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  image: 'https://example.com/rick.jpg',
  status: 'Alive',
  species: 'Human',
};

const mockCard: Card = {
  cardId: 'card-1-1',
  characterId: 1,
  pairId: 'pair-1',
  image: 'https://example.com/rick.jpg',
  name: 'Rick Sanchez',
  isFlipped: false,
  isMatched: false,
};

// ─── generateRandomIds ────────────────────────────────────────────────────────

describe('generateRandomIds', () => {
  it('returns the requested count of IDs', () => {
    const ids = generateRandomIds(9, 826);
    expect(ids).toHaveLength(9);
  });

  it('returns unique IDs', () => {
    const ids = generateRandomIds(9, 826);
    const unique = new Set(ids);
    expect(unique.size).toBe(9);
  });

  it('returns IDs within [1, max] range', () => {
    const ids = generateRandomIds(10, 50);
    ids.forEach((id) => {
      expect(id).toBeGreaterThanOrEqual(1);
      expect(id).toBeLessThanOrEqual(50);
    });
  });

  it('throws error when count > max (prevents infinite loop)', () => {
    expect(() => generateRandomIds(100, 50)).toThrow(
      'Cannot generate 100 unique IDs from range [1, 50]'
    );
  });

  it('throws error when count equals max + 1', () => {
    expect(() => generateRandomIds(11, 10)).toThrow(
      'Cannot generate 11 unique IDs from range [1, 10]'
    );
  });
});

// ─── generateCharacterIds ─────────────────────────────────────────────────────

describe('generateCharacterIds', () => {
  it('returns PAIR_COUNT unique IDs within totalCharacters range', () => {
    const ids = generateCharacterIds();
    expect(ids).toHaveLength(GAME_CONFIG.PAIR_COUNT);
    const unique = new Set(ids);
    expect(unique.size).toBe(GAME_CONFIG.PAIR_COUNT);
    ids.forEach((id) => {
      expect(id).toBeGreaterThanOrEqual(1);
      expect(id).toBeLessThanOrEqual(RICK_MORTY_API.TOTAL_CHARACTERS);
    });
  });
});

// ─── createCardPair ───────────────────────────────────────────────────────────

describe('createCardPair', () => {
  it('creates exactly 2 cards', () => {
    const pair = createCardPair(mockCharacter, 0);
    expect(pair).toHaveLength(2);
  });

  it('both cards share same characterId and pairId', () => {
    const [a, b] = createCardPair(mockCharacter, 0);
    expect(a.characterId).toBe(b.characterId);
    expect(a.pairId).toBe(b.pairId);
    expect(a.characterId).toBe(mockCharacter.id);
  });

  it('both cards have unique cardIds', () => {
    const [a, b] = createCardPair(mockCharacter, 0);
    expect(a.cardId).not.toBe(b.cardId);
  });

  it('cards start with isFlipped=false and isMatched=false', () => {
    const [a, b] = createCardPair(mockCharacter, 0);
    expect(a.isFlipped).toBe(false);
    expect(a.isMatched).toBe(false);
    expect(b.isFlipped).toBe(false);
    expect(b.isMatched).toBe(false);
  });

  it('cards contain correct image and name from character', () => {
    const [a] = createCardPair(mockCharacter, 0);
    expect(a.image).toBe(mockCharacter.image);
    expect(a.name).toBe(mockCharacter.name);
  });
});

// ─── createCards ─────────────────────────────────────────────────────────────

describe('createCards', () => {
  const characters: RickMortyCharacter[] = Array.from({ length: 9 }, (_, i) => ({
    ...mockCharacter,
    id: i + 1,
    name: `Character ${i + 1}`,
  }));

  it('creates 18 cards from 9 characters', () => {
    const cards = createCards(characters);
    expect(cards).toHaveLength(18);
  });

  it('each characterId appears exactly twice', () => {
    const cards = createCards(characters);
    characters.forEach((char) => {
      const matching = cards.filter((c) => c.characterId === char.id);
      expect(matching).toHaveLength(2);
    });
  });
});

// ─── shuffleCards ─────────────────────────────────────────────────────────────

describe('shuffleCards', () => {
  it('returns array of same length', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffleCards(arr)).toHaveLength(arr.length);
  });

  it('does not mutate the original array', () => {
    const arr = [1, 2, 3];
    const original = [...arr];
    shuffleCards(arr);
    expect(arr).toEqual(original);
  });

  it('contains all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleCards(arr);
    expect(shuffled.sort()).toEqual(arr.sort());
  });
});

// ─── isMatch ─────────────────────────────────────────────────────────────────

describe('isMatch', () => {
  it('returns true for cards with same characterId', () => {
    const [a, b] = createCardPair(mockCharacter, 0);
    expect(isMatch(a, b)).toBe(true);
  });

  it('returns false for cards with different characterId', () => {
    const [a] = createCardPair(mockCharacter, 0);
    const [b] = createCardPair({ ...mockCharacter, id: 99 }, 1);
    expect(isMatch(a, b)).toBe(false);
  });
});

// ─── isSelectable ─────────────────────────────────────────────────────────────

describe('isSelectable', () => {
  it('returns true for unflipped unmatched card with no firstCard', () => {
    expect(isSelectable(mockCard, null)).toBe(true);
  });

  it('returns false if card is already matched', () => {
    expect(isSelectable({ ...mockCard, isMatched: true }, null)).toBe(false);
  });

  it('returns false if card is already flipped', () => {
    expect(isSelectable({ ...mockCard, isFlipped: true }, null)).toBe(false);
  });

  it('returns false if card is same as firstCard (same cardId)', () => {
    expect(isSelectable(mockCard, mockCard)).toBe(false);
  });

  it('returns true if different card with same characterId (valid second selection)', () => {
    const [a, b] = createCardPair(mockCharacter, 0);
    expect(isSelectable(b, a)).toBe(true);
  });
});
