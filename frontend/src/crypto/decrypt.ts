// TODO: REFACTOR - This function uses Web Crypto API (crypto.subtle) which is not available in Node.js
// Unit tests for this function are too complex to setup in Vitest/msw environment
// Consider extracting to a testable wrapper or marking for integration testing only
export async function decrypt(bytes: BufferSource, key: BufferSource, iv: BufferSource) {
    const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'AES-GCM' }, false, [
        'decrypt',
    ]);

    const plainText = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, bytes);
    return plainText;
}
