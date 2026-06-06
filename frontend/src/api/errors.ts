import { AppError, AppErrorCode } from '../types';

export function downloadError(error: unknown): AppError {
    let code: AppErrorCode = 'unexpected-error';
    let message = 'An unexpected error occurred';

    if (error instanceof TypeError) {
        code = 'network-error';
        message = 'The server returned invalid data, the document could not be recovered';
    } else if (error instanceof DOMException && error.name === 'OperationError') {
        code = 'decryption-failed';
        message = 'The document could not be recovered using the provided cryptographic properties';
    } else if (error instanceof Error) {
        code = 'generic-error';
        message = error.message;
    }

    return { code, message };
}

export function uploadError(error: unknown): AppError {
    let code: AppErrorCode = 'unexpected-error';
    let message = 'An unexpected error occurred';

    if (error instanceof TypeError) {
        code = 'network-error';
        message = 'The server could not be reached, check your connectivity';
    } else if (error instanceof Error) {
        code = 'upload-error';
        message = error.message ?? 'Unknown error';
    }

    return { code, message };
}
