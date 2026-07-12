export type AppErrorCode =
    | 'unexpected-error'
    | 'network-error'
    | 'decryption-failed'
    | 'encryption-failed'
    | 'generic-error'
    | 'upload-error'
    | 'invalid-link'
    | 'invalid-file'
    | 'file-too-large'
    | 'file-type-not-allowed'
    | 'browser-operation-error';

export type AppError = {
    code: AppErrorCode;
    message: string;
};
