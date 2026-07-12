import { describe, expect, it } from 'vitest';
import { uploadError, downloadError } from '../../api/errors';
import { InvalidFileError, FileTooLargeError, FileTypeNotAllowedError } from '../../domain/errors';

describe('downloadError', () => {
    it('should return network-error for TypeError', () => {
        const error = new TypeError('Network error');
        const result = downloadError(error);
        expect(result.code).toBe('network-error');
        expect(result.message).toContain('server returned invalid data');
    });

    it('should return decryption-failed for DOMException OperationError', () => {
        const error = new DOMException('Decryption failed', 'OperationError');
        const result = downloadError(error);
        expect(result.code).toBe('decryption-failed');
        expect(result.message).toContain('could not be recovered');
    });

    it('should return generic-error for regular Error', () => {
        const error = new Error('Some error');
        const result = downloadError(error);
        expect(result.code).toBe('generic-error');
        expect(result.message).toBe('Some error');
    });

    it('should return unexpected-error for unknown error', () => {
        const result = downloadError(null);
        expect(result.code).toBe('unexpected-error');
    });
});

describe('uploadError', () => {
    it('should return network-error for TypeError', () => {
        const error = new TypeError('Network error');
        const result = uploadError(error);
        expect(result.code).toBe('network-error');
        expect(result.message).toContain('could not be reached');
    });

    it('should return browser-operation-error for DOMException', () => {
        const error = new DOMException('Browser error');
        const result = uploadError(error);
        expect(result.code).toBe('browser-operation-error');
        expect(result.message).toContain('Browser operation failed');
    });

    it('should return encryption-failed for DOMException OperationError', () => {
        const error = new DOMException('Encryption failed', 'OperationError');
        const result = uploadError(error);
        expect(result.code).toBe('encryption-failed');
        expect(result.message).toContain('could not be encrypted');
    });

    it('should return invalid-file for InvalidFileError', () => {
        const error = new InvalidFileError('Invalid file');
        const result = uploadError(error);
        expect(result.code).toBe('invalid-file');
        expect(result.message).toBe('Invalid file');
    });

    it('should return file-too-large for FileTooLargeError', () => {
        const error = new FileTooLargeError('File is too large');
        const result = uploadError(error);
        expect(result.code).toBe('file-too-large');
        expect(result.message).toBe('File is too large');
    });

    it('should return file-type-not-allowed for FileTypeNotAllowedError', () => {
        const error = new FileTypeNotAllowedError('File type not allowed');
        const result = uploadError(error);
        expect(result.code).toBe('file-type-not-allowed');
        expect(result.message).toBe('File type not allowed');
    });

    it('should return upload-error for generic Error', () => {
        const error = new Error('Upload failed');
        const result = uploadError(error);
        expect(result.code).toBe('upload-error');
        expect(result.message).toBe('Upload failed');
    });

    it('should return unexpected-error for unknown error', () => {
        const result = uploadError(null);
        expect(result.code).toBe('unexpected-error');
    });
});
