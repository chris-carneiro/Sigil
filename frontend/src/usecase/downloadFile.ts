import { getDocument as fetchDocument } from '../api/documents';
import { openEnvelope } from '../crypto/envelope';
import { decrypt } from '../crypto/decrypt';

import { triggerBrowserDownload } from '../utils/browser';
import { sha256 } from '../crypto/digest';

export async function downloadFile (documentId: string, key: string): Promise<string> {
    const { encryptedBytes, base64EncodedIV: iv } = await fetchDocument(documentId);

    const decodedKey = Uint8Array.fromBase64(key, {
        alphabet: 'base64url',
        lastChunkHandling: 'loose',
    });
    const decodedIv = Uint8Array.fromBase64(iv);

    const contents = await decrypt(encryptedBytes, decodedKey, decodedIv);

    const { metadata, payload: document } = openEnvelope(contents);

    triggerBrowserDownload(document, metadata);

    return sha256(document);
}
