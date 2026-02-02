import AsyncStorage from '@react-native-async-storage/async-storage';

export const COINS_KEY = 'BK_COINS_V1';
export const COLLECTION_KEY = 'BK_COLLECTION_V1';

export type CollectionId =
  | 'royalFruitGarden'
  | 'berryRainGlow'
  | 'berryForest'
  | 'berryCastle';

export type CollectionState = Record<CollectionId, number>;

export const defaultCollectionState: CollectionState = {
  royalFruitGarden: 0,
  berryRainGlow: 0,
  berryForest: 0,
  berryCastle: 0,
};

export async function loadCoins(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(COINS_KEY);
    const n = raw ? Number(JSON.parse(raw)) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export async function loadCollection(): Promise<CollectionState> {
  try {
    const raw = await AsyncStorage.getItem(COLLECTION_KEY);
    if (!raw) return defaultCollectionState;
    const parsed = JSON.parse(raw) as Partial<CollectionState>;
    return { ...defaultCollectionState, ...(parsed || {}) };
  } catch {
    return defaultCollectionState;
  }
}

export async function saveCollection(next: CollectionState) {
  await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(next));
}

function maskBits(mask: number) {
  return {
    tl: (mask & 1) !== 0,
    tr: (mask & 2) !== 0,
    bl: (mask & 4) !== 0,
    br: (mask & 8) !== 0,
  };
}

function setBit(mask: number, bit: 1 | 2 | 4 | 8) {
  return mask | bit;
}

export function isCardComplete(mask: number) {
  return mask & 1 && mask & 2 && mask & 4 && mask & 8;
}

export function getLockedPieces(mask: number) {
  const locked: Array<1 | 2 | 4 | 8> = [];
  if ((mask & 1) === 0) locked.push(1);
  if ((mask & 2) === 0) locked.push(2);
  if ((mask & 4) === 0) locked.push(4);
  if ((mask & 8) === 0) locked.push(8);
  return locked;
}

export async function unlockRandomPiece(): Promise<{
  next: CollectionState;
  unlocked?: { id: CollectionId; bit: 1 | 2 | 4 | 8 };
}> {
  const cur = await loadCollection();

  const pool: Array<{ id: CollectionId; bit: 1 | 2 | 4 | 8 }> = [];
  (Object.keys(cur) as CollectionId[]).forEach(id => {
    const locked = getLockedPieces(cur[id] || 0);
    locked.forEach(bit => pool.push({ id, bit }));
  });

  if (pool.length === 0) {
    return { next: cur };
  }

  const pick = pool[Math.floor(Math.random() * pool.length)];
  const next: CollectionState = {
    ...cur,
    [pick.id]: setBit(cur[pick.id] || 0, pick.bit),
  };

  await saveCollection(next);

  return { next, unlocked: pick };
}

export const pieceBits = {
  TL: 1 as const,
  TR: 2 as const,
  BL: 4 as const,
  BR: 8 as const,
};

export function getBits(mask: number) {
  return maskBits(mask);
}
