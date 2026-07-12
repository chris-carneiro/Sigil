// TODO: REFACTOR - This function uses DOM APIs (URL.createObjectURL, document.createElement) which are not available in Node.js
// Unit tests for this function are too complex to setup in Vitest/msw environment
// Consider extracting to a testable wrapper or marking for integration testing only
export function triggerBrowserDownload(
    data: Uint8Array<ArrayBuffer>,
    metadata: { mimeType: string; fileName: string },
) {
    const blobUrl = URL.createObjectURL(new Blob([data], { type: metadata.mimeType }));
    try {
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = metadata.fileName;
        downloadLink.click();
    } finally {
        URL.revokeObjectURL(blobUrl);
    }
}
