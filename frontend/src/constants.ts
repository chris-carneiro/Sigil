// File size and validation constants
export const FILE_SIZE_LIMIT = 10_000_000; // 10MB
export const FILENAME_LIMIT = 255;

// File type restrictions
export const BLOCKED_EXTENSIONS = new Set([
    '.exe', '.dll', '.so', // Executables
    '.js', '.py', '.sh', '.ps1', '.bat', '.cmd', // Scripts
    '.msi', '.app', // Installers
]);

export const ALLOWED_MIME_TYPES = new Set([
    // Text
    'text/plain',
    'text/csv',
    'text/markdown',
    'application/json',
    'application/xml',
    'application/pdf',
    // Images
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Video
    'video/mp4',
    'video/webm',
    'video/quicktime',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    // Archives
    'application/zip',
    'application/x-tar',
    'application/x-gzip',
    // Fallback
    'application/octet-stream',
]);

// Reserved Windows filenames
export const RESERVED_FILENAMES = new Set([
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9',
]);
