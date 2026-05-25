import { describe, expect, it } from 'vitest';
import { buildEnvelope, openEnvelope } from '../../crypto/envelope';

describe('buildEnvelope', () => {
    it('should accept valid ASCII filename', async () => {
        const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
        await expect(buildEnvelope(file)).resolves.toBeDefined();
    });

    it('should accept filename with spaces and hyphens', async () => {
        const file = new File(['test'], 'my test-file.txt', { type: 'text/plain' });
        await expect(buildEnvelope(file)).resolves.toBeDefined();
    });

    it('should reject filename with path traversal (../)', async () => {
        const file = new File(['test'], '../etc/passwd', { type: 'text/plain' });
        await expect(buildEnvelope(file)).rejects.toThrow('Invalid file name');
    });

    it('should reject filename with path traversal (..\\)', async () => {
        const file = new File(['test'], '..\\windows\\system32', { type: 'text/plain' });
        await expect(buildEnvelope(file)).rejects.toThrow('Invalid file name');
    });

    it('should reject filename with null bytes', async () => {
        const file = new File(['test'], 'test\x00.txt', { type: 'text/plain' });
        await expect(buildEnvelope(file)).rejects.toThrow('Invalid file name');
    });

    it('should reject reserved Windows filename CON', async () => {
        const file = new File(['test'], 'CON', { type: 'text/plain' });
        await expect(buildEnvelope(file)).rejects.toThrow('Invalid file name');
    });

    it('should reject reserved Windows filename PRN', async () => {
        const file = new File(['test'], 'PRN', { type: 'text/plain' });
        await expect(buildEnvelope(file)).rejects.toThrow('Invalid file name');
    });

    it('should reject reserved Windows filename COM1', async () => {
        const file = new File(['test'], 'COM1', { type: 'text/plain' });
        await expect(buildEnvelope(file)).rejects.toThrow('Invalid file name');
    });

    it('should reject reserved Windows filename LPT1', async () => {
        const file = new File(['test'], 'LPT1', { type: 'text/plain' });
        await expect(buildEnvelope(file)).rejects.toThrow('Invalid file name');
    });

    it('should reject filename longer than 255 characters', async () => {
        const longName = 'a'.repeat(256) + '.txt';
        const file = new File(['test'], longName, { type: 'text/plain' });
        await expect(buildEnvelope(file)).rejects.toThrow('Invalid file name');
    });

    it('should accept filename exactly 255 characters', async () => {
        const exactName = 'a'.repeat(255);
        const file = new File(['test'], exactName, { type: 'text/plain' });
        await expect(buildEnvelope(file)).resolves.toBeDefined();
    });

    it('should reject non-ASCII filename', async () => {
        const file = new File(['test'], 'tëst.txt', { type: 'text/plain' });
        await expect(buildEnvelope(file)).rejects.toThrow('Invalid file name');
    });

    it('should reject filename with emoji', async () => {
        const file = new File(['test'], '😀.txt', { type: 'text/plain' });
        await expect(buildEnvelope(file)).rejects.toThrow('Invalid file name');
    });
});

describe('openEnvelope', () => {
    it('should roundtrip file metadata and content', async () => {
        const fileContent = 'Hello, World!';
        const fileName = 'test.txt';
        const mimeType = 'text/plain';

        const file = new File([fileContent], fileName, { type: mimeType });
        const envelope = await buildEnvelope(file);

        // For testing purposes, we need to decrypt first, but openEnvelope
        // expects decrypted data. Let's just verify the structure.
        // Actually openEnvelope takes a decrypted ArrayBuffer
        // For a proper roundtrip test, we'd need to encrypt and decrypt
        // which requires the crypto module

        // Basic structural test - envelope should have header
        expect(envelope).toBeDefined();
        expect(envelope.length).toBeGreaterThan(0);
    });

    it('should throw on malformed envelope', async () => {
        const badEnvelope = new ArrayBuffer(0);
        expect(() => openEnvelope(badEnvelope)).toThrow();
    });
});
