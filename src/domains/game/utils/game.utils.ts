import type { RickMortyCharacter, Card } from '../types/game.types';
import { RICK_MORTY_API, GAME_CONFIG } from '../constants/game.constants';

// ─── Pure utility functions ───────────────────────────────────────────────────

/**
 * Generates N unique random integers in range [1, max].
 * Pure function — same range always produces valid random results.
 */
export const generateRandomIds = (count: number, max: number): number[] => {
  const ids = new Set<number>();
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(ids);
};

/**
 * Generates random character IDs for the current game.
 */
export const generateCharacterIds = (): number[] =>
  generateRandomIds(GAME_CONFIG.PAIR_COUNT, RICK_MORTY_API.TOTAL_CHARACTERS);

/**
 * Creates a pair of Card objects from a single character.
 * Each card gets a unique cardId, both share the same characterId and pairId.
 */
export const createCardPair = (character: RickMortyCharacter, pairIndex: number): [Card, Card] => {
  const pairId = `pair-${character.id}`;
  const base: Omit<Card, 'cardId'> = {
    characterId: character.id,
    pairId,
    image: character.image,
    name: character.name,
    isFlipped: false,
    isMatched: false,
  };
  return [
    { ...base, cardId: `card-${pairIndex * 2 + 1}-${character.id}` },
    { ...base, cardId: `card-${pairIndex * 2 + 2}-${character.id}` },
  ];
};

/**
 * Duplicates characters array into 16 cards (8 pairs).
 */
export const createCards = (characters: RickMortyCharacter[]): Card[] =>
  characters.flatMap((char, i) => createCardPair(char, i));

/**
 * Fisher-Yates shuffle. Returns a new shuffled array (immutable).
 */
export const shuffleCards = <T>(array: T[]): T[] => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/**
 * Returns true if two cards belong to the same character pair.
 * Compares characterId (not cardId, which is unique per card).
 */
export const isMatch = (a: Card, b: Card): boolean =>
  a.characterId === b.characterId;

/**
 * Returns true if the card can be selected (not matched, not already flipped).
 */
export const isSelectable = (card: Card, firstCard: Card | null): boolean =>
  !card.isMatched && !card.isFlipped && card.cardId !== firstCard?.cardId;
