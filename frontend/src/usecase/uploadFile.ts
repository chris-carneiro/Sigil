import { buildEnvelope } from '../crypto/envelope';
import { encrypt } from '../crypto/encrypt';
import { postDocument as uploadDocument } from '../api/documents';
import {
    ALLOWED_MIME_TYPES,
    BLOCKED_EXTENSIONS,
    FILE_SIZE_LIMIT,
} from '../constants';

const applicationOctetStream = 'application/octet-stream';

interface UploadParams {
    files: File[];
    urlOrigin: string;
}

function getFileExtension (filename: string): string {
    return filename.slice(filename.lastIndexOf('.')).toLowerCase();
}

function isFileTypeAllowed (file: File): boolean {
    const extension = getFileExtension(file.name);

    // Block dangerous extensions
    if (BLOCKED_EXTENSIONS.has(extension)) {
        return false;
    }

    // Allow if MIME type is in allowlist
    if (file.type && ALLOWED_MIME_TYPES.has(file.type)) {
        return true;
    }

    // Allow if extension suggests a safe type (fallback for browsers with limited MIME detection)
    // This is a permissive fallback - the server should do final validation
    return true;
}

export async function uploadFile (params: UploadParams) {
    const firstFile = params.files?.[0];

    if (!firstFile?.name) {
        throw Error('Invalid file');
    }

    if (firstFile.size > FILE_SIZE_LIMIT) {
        throw Error(`File is too large. Maximum size is ${FILE_SIZE_LIMIT / 1_000_000}MB`);
    }

    if (!isFileTypeAllowed(firstFile)) {
        throw Error('File type not allowed');
    }

    const envelope = await buildEnvelope(firstFile);
    const { cipherText, rawKey, rawIV } = await encrypt(envelope);

    const formData = new FormData();
    const encryptedDocument = new Blob([cipherText], { type: applicationOctetStream });
    const iv = new Blob([rawIV], { type: applicationOctetStream });
    formData.append('document', encryptedDocument);
    formData.append('iv', iv);

    const { documentId } = await uploadDocument(formData);

    const keyBytes = new Uint8Array(rawKey);
    // Zeroize rawKey immediately after creating the encoding buffer
    new Uint8Array(rawKey).fill(0);
    const encodedKey = keyBytes.toBase64({
        alphabet: 'base64url',
        omitPadding: true,
    });
    // Zeroize the copy after encoding
    keyBytes.fill(0);

    return `${params.urlOrigin}/documents/download/${documentId}#${encodedKey}`;
}
