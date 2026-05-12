const HEADER_LENGTH = 4;


export async function buildEnvelope(file: File): Promise<Uint8Array<ArrayBuffer>> {
    if (!isAscii(file)) {
        throw new Error("The file name format is not supported, use only alphanumeric characters");
    }

    const fileNameLimit = 255;
    if (file.name.length > fileNameLimit) {
        throw new Error("The file name is too long > " + fileNameLimit);
    }

    const meta: FileMetadata = { fileName: file.name, mimeType: file.type || "application/octet-stream" };
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

function isAscii(file: File) {
    return new TextEncoder().encode(file.name).length == file.name.length;
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
    fileName: string
    mimeType: string
}

export type EnvelopeContents = {
    metadata: FileMetadata
    rawFile: Uint8Array
}

export function openEnvelope(decryptedEnvelope: ArrayBuffer) : EnvelopeContents {
    try {

        const envelopeBytes = new Uint8Array(decryptedEnvelope);
        const metadataLength = envelopeBytes.subarray(0, HEADER_LENGTH);

        // extracts metadata array length as integer value.
        const metadataSize = new DataView(metadataLength.buffer, metadataLength.byteOffset, metadataLength.byteLength).getUint32(0);
        const metadataEndIndex = HEADER_LENGTH + metadataSize;
        if (metadataEndIndex > envelopeBytes.length) throw new Error("Envelope format violation detected");

        const jsonBytes = envelopeBytes.subarray(HEADER_LENGTH, metadataEndIndex);
        const metadata = JSON.parse(new TextDecoder().decode(jsonBytes));
        const data = envelopeBytes.subarray(metadataEndIndex);

        return { metadata, rawFile: data };
    } catch (e: any) {

        throw new Error(e.message || "Error spliting envelope");
    }
}
