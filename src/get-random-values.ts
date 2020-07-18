import seedRandom from 'seedrandom';

export function getRandomValues(blankUint8Array: Uint8Array): Uint8Array {
  const rng = seedRandom();

  return blankUint8Array.map((b) => Math.floor(rng() * 256));
}
