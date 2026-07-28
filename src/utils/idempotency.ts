/**
 * Utility for generating idempotency keys
 */

const UUID_V7_RANDOM_BYTES = 10;

/**
 * Generate a UUIDv7 idempotency key.
 */
export function generateIdempotencyKey(): string {
  const random = randomBytes(UUID_V7_RANDOM_BYTES);
  const timestamp = BigInt(Date.now()) & ((1n << 48n) - 1n);
  const randA = ((BigInt(random[0]) << 8n) | BigInt(random[1])) & 0xfffn;
  let randB = 0n;
  for (const byte of random.slice(2)) {
    randB = (randB << 8n) | BigInt(byte);
  }
  randB &= (1n << 62n) - 1n;

  const value = (timestamp << 80n) | (0x7n << 76n) | (randA << 64n) | (0x2n << 62n) | randB;
  const hex = value.toString(16).padStart(32, '0');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function randomBytes(length: number): Uint8Array {
  const globalCrypto = typeof crypto !== 'undefined' ? crypto : undefined;
  if (globalCrypto?.getRandomValues) {
    return globalCrypto.getRandomValues(new Uint8Array(length));
  }

  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return bytes;
}
