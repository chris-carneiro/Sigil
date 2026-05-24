export async function decrypt (bytes: BufferSource, key: BufferSource, iv: BufferSource) {
    const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'AES-GCM' }, false, [
        'decrypt',
    ]);

    const plainText = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, bytes);
    return plainText;
}
