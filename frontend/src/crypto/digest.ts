// TODO: REFACTOR - This function uses Web Crypto API (crypto.subtle) which is not available in Node.js
// Unit tests for this function are too complex to setup in Vitest/msw environment
// Consider extracting to a testable wrapper or marking for integration testing only
export async function sha256(data: BufferSource): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
