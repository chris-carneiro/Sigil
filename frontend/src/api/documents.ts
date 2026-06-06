export type UploadResponse = {
    documentId: string;
};

export type FetchResponse = {
    encryptedBytes: ArrayBuffer;
    base64EncodedIV: string;
};

export async function postDocument(formData: FormData): Promise<UploadResponse> {
    const response = await fetch('/api/v1/documents', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw Error('The encrypted document could not be stored');
    }

    const body = await response.json();
    const documentId = body.documentId;

    if (typeof documentId !== 'string' || documentId.length === 0) {
        throw Error('Unable to create QRCode: Invalid document identity');
    }

    return { documentId };
}

export async function getDocument(documentId: string): Promise<FetchResponse> {
    const response = await fetch('/api/v1/documents/' + documentId, {
        method: 'GET',
    });

    if (!response.ok) {
        throw Error('The encrypted document could not be fetched');
    }

    const encryptedBytes = await response.arrayBuffer();
    const iv = response.headers.get('encryption-metadata-iv');

    if (typeof iv !== 'string' || iv.length === 0) {
        throw Error('Unable to fetch document: Invalid encryption properties');
    }

    return { encryptedBytes, base64EncodedIV: iv };
}
