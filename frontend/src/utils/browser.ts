export function triggerBrowserDownload (
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
