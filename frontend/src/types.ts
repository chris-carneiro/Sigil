export type AppErrorCode =
    | 'unexpected-error'
    | 'network-error'
    | 'decryption-failed'
    | 'generic-error'
    | 'upload-error'
    | 'invalid-link';

export type AppError = {
    code: AppErrorCode;
    message: string;
};
