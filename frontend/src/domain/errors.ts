export class InvalidFileError extends Error {
    constructor(message: string = 'Invalid file') {
        super(message);
        this.name = 'InvalidFileError';
    }
}

export class FileTooLargeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FileTooLargeError';
    }
}

export class FileTypeNotAllowedError extends Error {
    constructor(message: string = 'File type not allowed') {
        super(message);
        this.name = 'FileTypeNotAllowedError';
    }
}
