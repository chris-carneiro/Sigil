import { http, HttpResponse } from 'msw';

export const handlers = [
    http.post('/api/v1/documents', async () => {
        return HttpResponse.json({
            documentId: 'mock-document-id',
        });
    }),

    http.get('/api/v1/documents/:id', async () => {
        const encryptedBytes = new Uint8Array([1, 2, 3, 4, 5]).buffer;
        const base64EncodedIV = btoa(String.fromCharCode(...new Uint8Array([6, 7, 8, 9, 10, 11, 12])));

        return HttpResponse.json({
            encryptedBytes,
            base64EncodedIV,
        });
    }),
];
