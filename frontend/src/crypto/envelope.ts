import { FILENAME_LIMIT, RESERVED_FILENAMES } from '../constants';

const HEADER_LENGTH = 4;

function isValidFilename(file: File): boolean {
    const name = file.name;

    // Check for null bytes
    if (name.includes('\0')) {
        return false;
    }

    // Check for path traversal
    if (name.includes('../') || name.includes('..\\')) {
        return false;
    }

    // Check for reserved Windows filenames
    const baseName = name.split('/').pop()?.split('\\').pop() || name;
    if (RESERVED_FILENAMES.has(baseName.toUpperCase())) {
        return false;
    }

    // Check length
    if (name.length > FILENAME_LIMIT) {
        return false;
    }

    // Check ASCII (original check)
    return new TextEncoder().encode(name).length === name.length;
}

export async function buildEnvelope(file: File): Promise<Uint8Array<ArrayBuffer>> {
    if (!isValidFilename(file)) {
        throw new Error(
            'Invalid file name: contains forbidden characters, path traversal, or is too long',
        );
    }

    const meta: FileMetadata = {
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
    };
    const metadata = JSON.stringify(meta);

    const jsonMetadata = buildJsonMetadata(metadata);
    const fileBytes = await buildFileBytes(file);
    const header = buildHeader(jsonMetadata.length);

    // building envelope
    const envelopeLength = HEADER_LENGTH + jsonMetadata.length + fileBytes.length;
    const envelope = new Uint8Array(envelopeLength);

    envelope.set(header);
    envelope.set(jsonMetadata, HEADER_LENGTH);
    envelope.set(fileBytes, HEADER_LENGTH + jsonMetadata.length);

    return envelope;
}

async function buildFileBytes(file: File) {
    const fileBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(fileBuffer);
    return fileBytes;
}

function buildJsonMetadata(metadata: string): Uint8Array {
    const textEncoder = new TextEncoder();
    const jsonMetadata = textEncoder.encode(metadata);
    return jsonMetadata;
}

function buildHeader(metadataLength: number) {
    const headerBuffer = new ArrayBuffer(HEADER_LENGTH);
    const view = new DataView(headerBuffer);
    view.setUint32(0, metadataLength);
    const header = new Uint8Array(headerBuffer);
    return header;
}

export type FileMetadata = {
    fileName: string;
    mimeType: string;
};

export type EnvelopeContents = {
    metadata: FileMetadata;
    payload: Uint8Array<ArrayBuffer>;
};

export function openEnvelope(decryptedEnvelope: ArrayBuffer): EnvelopeContents {
    try {
        const envelopeBytes = new Uint8Array(decryptedEnvelope);
        const metadataLength = envelopeBytes.subarray(0, HEADER_LENGTH);

        // extracts metadata array length as integer value.
        const metadataSize = new DataView(
            metadataLength.buffer,
            metadataLength.byteOffset,
            metadataLength.byteLength,
        ).getUint32(0);
        const metadataEndIndex = HEADER_LENGTH + metadataSize;
        if (metadataEndIndex > envelopeBytes.length)
            throw new Error('Envelope format violation detected');

        const jsonBytes = envelopeBytes.subarray(HEADER_LENGTH, metadataEndIndex);
        const metadata = JSON.parse(new TextDecoder().decode(jsonBytes));
        const payload = envelopeBytes.subarray(metadataEndIndex);

        return { metadata, payload };
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Error splitting envelope';
        throw new Error(message);
    }
}
