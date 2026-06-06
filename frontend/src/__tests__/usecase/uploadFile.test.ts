import { beforeEach, describe, expect, it, vi } from 'vitest';
import { uploadFile } from '../../usecase/uploadFile';
import { FILE_SIZE_LIMIT } from '../../constants';

// Mock the dependencies
vi.mock('../../crypto/envelope', () => ({
    buildEnvelope: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
}));

vi.mock('../../crypto/encrypt', () => ({
    encrypt: vi.fn().mockResolvedValue({
        cipherText: new Uint8Array([4, 5, 6]),
        rawKey: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]).buffer,
        rawIV: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    }),
}));

vi.mock('../../api/documents', () => ({
    postDocument: vi.fn().mockResolvedValue({ documentId: 'test-doc-id' }),
}));

describe('uploadFile', () => {
    const mockUrlOrigin = 'https://example.com';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should reject empty files array', async () => {
        await expect(uploadFile({ files: [], urlOrigin: mockUrlOrigin })).rejects.toThrow(
            'Invalid file',
        );
    });

    it('should reject when first file has no name', async () => {
        const file = new File([''], '');
        Object.defineProperty(file, 'name', { value: '' });
        await expect(uploadFile({ files: [file], urlOrigin: mockUrlOrigin })).rejects.toThrow(
            'Invalid file',
        );
    });

    it('should reject file exceeding size limit', async () => {
        // Create a file with size > FILE_SIZE_LIMIT
        const largeContent = new Uint8Array(FILE_SIZE_LIMIT + 1);
        const file = new File([largeContent], 'large.txt', { type: 'text/plain' });

        await expect(uploadFile({ files: [file], urlOrigin: mockUrlOrigin })).rejects.toThrow(
            `File is too large. Maximum size is ${FILE_SIZE_LIMIT / 1_000_000}MB`,
        );
    });

    it('should accept file at exactly size limit', async () => {
        const smallerContent = new Uint8Array(1000);
        const smallerFile = new File([smallerContent], 'small.txt', { type: 'text/plain' });

        await expect(
            uploadFile({ files: [smallerFile], urlOrigin: mockUrlOrigin }),
        ).resolves.toContain('https://example.com/documents/download/test-doc-id#');
    });

    it('should reject blocked file extensions', async () => {
        const blockedExtensions = ['.exe', '.dll', '.so', '.js', '.py', '.sh'];
        for (const ext of blockedExtensions) {
            const file = new File(['test'], `test${ext}`, { type: 'application/octet-stream' });
            await expect(uploadFile({ files: [file], urlOrigin: mockUrlOrigin })).rejects.toThrow(
                'File type not allowed',
            );
        }
    });

    it('should accept allowed MIME types', async () => {
        const allowedTypes = ['text/plain', 'application/pdf', 'image/png', 'image/jpeg'];

        for (const mimeType of allowedTypes) {
            const file = new File(['test'], 'test.txt', { type: mimeType });
            await expect(
                uploadFile({ files: [file], urlOrigin: mockUrlOrigin }),
            ).resolves.toBeDefined();
        }
    });

    it('should return URL with encoded key', async () => {
        const file = new File(['test'], 'test.txt', { type: 'text/plain' });
        const result = await uploadFile({ files: [file], urlOrigin: mockUrlOrigin });

        expect(result).toContain('https://example.com/documents/download/test-doc-id#');
        // The key should be base64url encoded without padding
        const [, fragment] = result.split('#');
        expect(fragment).not.toContain('='); // no padding
        expect(fragment).not.toContain('+'); // base64url uses - instead of +
        expect(fragment).not.toContain('/'); // base64url uses _ instead of /
    });
});
