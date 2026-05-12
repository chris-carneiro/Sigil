import { useReducer } from "react";
import styles from './DownloadPage.module.css'
import { getDocument as fetchDocument } from "../../api/documents";
import { decrypt } from "../../crypto/decrypt";
import { openEnvelope } from "../../crypto/envelope";

type DownloadState =
    | { status: 'idle'; key: string; documentId: string }
    | { status: 'downloading' }
    | { status: 'done'; }
    | { status: 'error'; message: string }

type DownloadAction =
    | { type: 'clicked-download'; }
    | { type: 'fetched-document'; }
    | { type: 'failed-download'; message: string }


export function DownloadPage() {
    const [state, dispatch] = useReducer(reducer, null, init)


    async function handleDownload(documentId: string, key: string) {
        dispatch({ type: 'clicked-download' })
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

            dispatch({ type: 'fetched-document' })
            URL.revokeObjectURL(blobUrl);

        } catch (e: any) {

            if (e instanceof TypeError) {
                dispatch({ type: 'failed-download', message: "The server returned invalid data, the document could not be recovered" });
                return;
            }

            if (e instanceof DOMException && e.name === "OperationError") {
                dispatch({ type: 'failed-download', message: "The document could not be recovered using the provided cryptographic properties" });
                return;
            }

            dispatch({ type: 'failed-download', message: e.message ? e.message : "An unhandled error occured=" + e.constructor.name });

        }
    }


    if (state.status == 'idle') {
        return (
            <>
                <div>
                    <button className={styles.button} type="button"
                        onClick={() => handleDownload(state.documentId, state.key)} >Download</button>
                </div>
            </>
        )
    }

    if (state.status == 'downloading') {
        return (
            <>
                <div>
                    <p>Downloading...</p>
                </div>
            </>
        )
    }

    if (state.status == 'done') {
        return (
            <>
                <div>
                    <p>Done...</p>
                </div>
            </>
        )
    }

    if (state.status == 'error') {
        const message = state.message;
        return (
            <>
                <div>
                    <p>{message}</p>
                </div>
            </>
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
        message: 'This link is invalid or had expired'
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
                message: action.message
            }
        }

    }

}