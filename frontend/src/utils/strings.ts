export function truncateMiddle (filename: string): string {
    const maxLength: number = 20;

    if (filename.length >= maxLength) {
        const firstHalf = filename.slice(0, Math.floor(maxLength / 2));
        const lastHalf = filename.slice(filename.length - Math.ceil(maxLength / 2));

        const truncatedFilename = firstHalf + ' \u2026 ' + lastHalf;
        return truncatedFilename;
    }
    return filename;
}
