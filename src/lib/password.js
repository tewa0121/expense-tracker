// Password hashing with the browser's Web Crypto API (PBKDF2-SHA256).
// This is still a client-only demo store, but passwords are no longer kept in plaintext.

const ITERATIONS = 150_000;

const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

async function derive(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure browser features are unavailable. Open the app over HTTPS or localhost.');
  }
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
  );
  return crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' }, key, 256
  );
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { salt: toB64(salt), hash: toB64(await derive(password, salt)) };
}

export async function verifyPassword(password, { salt, hash }) {
  const candidate = toB64(await derive(password, fromB64(salt)));
  return candidate === hash;
}

export const newId = () =>
  globalThis.crypto?.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
