import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCharacters } from '../services/rickmorty.api';
import type { RickMortyCharacter } from '../types/game.types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const validCharacter: RickMortyCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  status: 'Alive',
  species: 'Human',
};

const makeCharacters = (count: number): RickMortyCharacter[] =>
  Array.from({ length: count }, (_, i) => ({ ...validCharacter, id: i + 1 }));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('fetchCharacters', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns success with validated characters on 200 response', async () => {
    const chars = makeCharacters(9);
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => chars,
    } as Response);

    const result = await fetchCharacters([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(9);
    expect(result.data?.[0].name).toBe('Rick Sanchez');
  });

  it('wraps a single-object response in an array', async () => {
    const single = makeCharacters(1);
    // API with a single ID returns object, not array
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => single[0],
    } as Response);

    const result = await fetchCharacters([1]);
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
  });

  it('returns error when HTTP response is not ok', async () => {
    vi.mocked(fetch)
      .mockResolvedValue({ ok: false, status: 500, json: async () => ({}) } as Response);

    const result = await fetchCharacters([1]);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns specific error on 429 Too Many Requests', async () => {
    vi.mocked(fetch)
      .mockResolvedValue({ ok: false, status: 429, json: async () => ({}) } as Response);

    const result = await fetchCharacters([1]);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Demasiadas peticiones');
  });

  it('returns error on network failure after retries', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const result = await fetchCharacters([1]);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns error when response has fewer than PAIR_COUNT valid characters', async () => {
    const tooFew = makeCharacters(3);
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => tooFew,
    } as Response);

    const result = await fetchCharacters([1, 2, 3]);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('returns error on malformed response (missing name)', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [{ id: 1, image: 'x.jpg' }], // missing name
    } as Response);

    const result = await fetchCharacters([1]);
    expect(result.success).toBe(false);
  });
});
