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
