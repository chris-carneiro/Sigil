// TODO: REFACTOR - This function uses Web Crypto API (crypto.subtle) which is not available in Node.js
// Unit tests for this function are too complex to setup in Vitest/msw environment
// Consider extracting to a testable wrapper or marking for integration testing only
type EncryptedResult = {
    cipherText: ArrayBuffer;
    rawKey: ArrayBuffer;
    rawIV: Uint8Array<ArrayBuffer>;
};

export async function encrypt(envelope: BufferSource): Promise<EncryptedResult> {
    const cryptoKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
        'encrypt',
        'decrypt',
    ]);
    const rawKey = await crypto.subtle.exportKey('raw', cryptoKey);

    const rawIV = crypto.getRandomValues(new Uint8Array(12));
    const cipherText = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: rawIV },
        cryptoKey,
        envelope,
    );

    return { cipherText, rawKey, rawIV };
}
