import { useReducer } from "react";
import styles from './DownloadPage.module.css'
import { getDocument as fetchDocument } from "../../api/documents";
import { decrypt } from "../../crypto/decrypt";
import { openEnvelope } from "../../crypto/envelope";
import { Card } from "../common/Card";
import { ErrorDisplay } from "../common/ErrorDisplay";
import { AppError } from "../../types";

type DownloadState =
    | { status: 'idle'; key: string; documentId: string }
    | { status: 'downloading' }
    | { status: 'done'; }
    | { status: 'error'; error: AppError }

type DownloadAction =
    | { type: 'clicked-download'; }
    | { type: 'fetched-document'; }
    | { type: 'failed-download'; error: AppError }

export function DownloadPage() {
    const [state, dispatch] = useReducer(reducer, null, init)


    async function handleDownload(documentId: string, key: string) {
        dispatch({ type: 'clicked-download' });

        try {
            const { encryptedBytes, base64EncodedIV: iv } = await fetchDocument(documentId);


            const decodedKey = Uint8Array.fromBase64(key, { alphabet: "base64url", lastChunkHandling: 'loose' });
            const decodedIv = Uint8Array.fromBase64(iv);
            const envelop = await decrypt(encryptedBytes, decodedKey, decodedIv);

            const { metadata, rawFile: data } = openEnvelope(envelop);

            const blobUrl = URL.createObjectURL(new Blob([data], { type: metadata.mimeType }));


            const downloadLink = document.createElement("a");
            downloadLink.href = blobUrl;
            downloadLink.download = metadata.fileName;
            downloadLink.click();
            URL.revokeObjectURL(blobUrl);

            dispatch({ type: 'fetched-document' });

        } catch (e: unknown) {

            if (e instanceof TypeError) {
                dispatch({ type: 'failed-download', error: { code: 'network-error', message: "The server returned invalid data, the document could not be recovered" } });
                return;
            }

            if (e instanceof DOMException && e.name === "OperationError") {
                dispatch({ type: 'failed-download', error: { code: 'decryption-failed', message: "The document could not be recovered using the provided cryptographic properties" } });
                return;
            }

            const message = e instanceof Error ? e.message : 'An unhandled error occurred';
            dispatch({ type: 'failed-download', error: { code: 'unknown-error', message: message } });

        }
    }


    if (state.status == 'idle') {
        return (
            <Card>
                <button className={styles.button} type="button"
                    onClick={() => handleDownload(state.documentId, state.key)} >Download</button>
            </Card>
        )
    }

    if (state.status == 'downloading') {
        return (
            <Card>
                <div>
                    <p>Downloading...</p>
                </div>
            </Card>
        )
    }

    if (state.status == 'done') {
        return (
            <Card>
                <div>
                    <p>Done...</p>
                </div>
            </Card>
        )
    }

    if (state.status == 'error') {
        return (
            <Card variant="danger">
                <ErrorDisplay error={state.error} />
            </Card>
        )
    }
}

function init(): DownloadState {
    const path = window.location.pathname;
    const fragment = window.location.hash;

    if (path.includes("/documents/download") && fragment) {
        const pathEnd = path.lastIndexOf("/");
        const documentId = path.substring(pathEnd + 1);
        const key = fragment.substring(fragment.lastIndexOf('#') + 1);
        return {
            status: 'idle',
            key: key,
            documentId: documentId,
        };
    }

    return {
        status: 'error',
        error: { code: 'invalid-link', message: 'This link is invalid or has expired' }
    }
}
function reducer(state: DownloadState, action: DownloadAction): DownloadState {
    switch (action.type) {
        case 'clicked-download': {
            return {
                status: 'downloading'
            }
        }
        case 'fetched-document': {
            return {
                status: 'done',
            }
        }
        case 'failed-download': {
            return {
                status: 'error',
                error: action.error
            }
        }
    }
}