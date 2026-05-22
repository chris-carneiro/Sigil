import { AppError } from '../types';

export function downloadError(error: unknown): AppError {
    let appError: AppError = {
        code: 'unexpected-error',
        message: 'An unexpected error occurred',
    };

    if (error instanceof TypeError) {
        appError = {
            code: 'network-error',
            message: 'The server returned invalid data, the document could not be recovered',
        };
    } else if (error instanceof DOMException && error.name === 'OperationError') {
        appError = {
            code: 'decryption-failed',
            message:
                'The document could not be recovered using the provided cryptographic properties',
        };
    } else if (error instanceof Error) {
        const message = error.message;
        appError = {
            code: 'generic-error',
            message: message,
        };
    }

    return appError;
}

// TODO create dedicated custom Error types
export function uploadError(error: unknown): AppError {
    let appError: AppError = {
        code: 'unexpected-error',
        message: 'An unexpected error occurred',
    };

    if (error instanceof TypeError) {
        appError = {
            code: 'network-error',
            message: 'The server could not be reached, check your connectivity',
        };
    } else if (error instanceof Error) {
        appError = {
            code: 'upload-error',
            message: error.message ?? 'Unknown error',
        };
    }

    return appError;
}
