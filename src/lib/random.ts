/**
 * Тодорхой үртэй (seeded) санамсаргүй тоо — сервер ба клиент дээр ижил
 * утга өгч, hydration зөрүү үүсгэхгүй.
 */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0 || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4_294_967_296;
  };
}
