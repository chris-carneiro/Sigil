import styles from './DownloadPage.module.css'
import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from '../common/Card';
import { ErrorDisplay } from '../common/ErrorDisplay';
import { SigilIndicator } from '../common/SigilIndicator';
import { DocumentId } from '../common/DocumentId';
import { Button } from '../common/Button';
import { withMinimumDuration } from '../../utils/async'
import { downloadError } from '../../api/errors';
import { downloadFile } from '../../usecase/downloadFile';
import { AppError } from '../../types';
import { ClipboardCopy } from '../common/ClipboardCopy';
import { truncateMiddle } from '../../utils/strings';

type DownloadState =
    | { status: 'idle'; key: string; documentId: string }
    | { status: 'downloading' }
    | { status: 'done'; hash: string }
    | { status: 'error'; error: AppError }

type DownloadAction =
    | { type: 'clicked-download'; }
    | { type: 'fetched-document'; hash: string }
    | { type: 'failed-download'; error: AppError }

function DownloadPage() {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, null, init);

    async function handleDownload(documentId: string, key: string): Promise<void> {
        dispatch({ type: 'clicked-download' });
        try {
            const hash = await withMinimumDuration(downloadFile(documentId, key), 1500);

            dispatch({ type: 'fetched-document', hash });


        } catch (e: unknown) {
            dispatch({ type: 'failed-download', error: downloadError(e) });
        }
    }

    if (state.status == 'idle') {
        return (
            <Card className={styles.card}>
                <div className={styles.info}>
                    <span>You've received a document privately sent:</span>
                </div>
                <DocumentId documentId={state.documentId} />
                <Button label="Download & Decrypt" onClick={() => handleDownload(state.documentId, state.key)} />
            </Card>
        )
    }

    if (state.status == 'downloading') {
        return (
            <Card className={styles.card}>
                <SigilIndicator label="Downloading..." alt="Downloading & Decrypting" />
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

    if (state.status == 'done') {
        const sha256 = "SHA-256:" + truncateMiddle(state.hash)
        return (
            <Card className={styles.card}>
                <div className={styles.info}>
                    <span>Download complete!</span>
                </div>
                <ClipboardCopy label={sha256} textCopy={state.hash} className={styles.hash} />
                <Button label="Return Home" onClick={() => navigate('/')} />
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
                hash: action.hash
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

export default DownloadPage;