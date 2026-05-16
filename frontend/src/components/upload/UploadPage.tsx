import { useReducer } from 'react';
import SelectFile from './SelectFile';
import { buildEnvelope } from '../../crypto/envelope';
import { encrypt } from '../../crypto/encrypt';
import { postDocument as uploadDocument } from '../../api/documents';
import { Card } from '../common/Card';
import { ErrorDisplay } from '../common/ErrorDisplay';
import { AppError } from '../../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { FileDropzone } from './FileDropzone';
import { Button } from '../common/Button';
import styles from './UploadPage.module.css';
import { SelectedFileList } from './SelectedFileList';
import { EncryptingIndicator } from '../common/EncryptingIndicator';
import { withMinimumDuration } from '../utils/async';

type UploadState =
    | { status: 'idle'; stagedFiles?: File[] }
    | { status: 'encrypting' }
    | { status: 'done'; qrUrl: string }
    | { status: 'error'; error: AppError }

type UploadAction =
    | { type: "selected-file"; files: File[] }
    | { type: "encrypted-file"; }
    | { type: "succeeded-upload"; qrUrl: string }
    | { type: "deleted-file"; file: File }
    | { type: "failed-upload"; error: AppError }

const initialState: UploadState = { status: 'idle' };


function UploadPage() {

    const [state, dispatch] = useReducer(reducer, initialState);

    async function handleUpload(files: File[]) {
        dispatch({ type: 'encrypted-file' })
        const firstFile = files[0];
        const fileSizeLimit = 10000000;

        try {

            if (!firstFile || !firstFile.name) {
                dispatch({ type: 'failed-upload', error: { code: 'unsupported-file', message: "Invalid file name" } });
                return;
            }

            if (firstFile.size > fileSizeLimit) {
                dispatch({ type: 'failed-upload', error: { code: 'unsupported-file', message: "File is too large" } });
                return;
            }

            const envelope = await buildEnvelope(firstFile);
            const { cipherText, rawKey, iv } = await withMinimumDuration(
                encrypt(envelope),
                2000
            );

            const formData = new FormData();

            formData.append("document", new Blob([cipherText], { type: "application/octet-stream" }));
            formData.append("iv", new Blob([iv], { type: "application/octet-stream" }));

            const { documentId } = await uploadDocument(formData);

            const encodedKey = new Uint8Array(rawKey).toBase64({ alphabet: "base64url", omitPadding: true });

            new Uint8Array(rawKey).fill(0);

            const qrUrl = `${window.location.origin}/documents/download/${documentId}#${encodedKey}`;

            dispatch({ type: 'succeeded-upload', qrUrl })

        } catch (e: unknown) {
            if (e instanceof TypeError) {

                dispatch({
                    type: 'failed-upload', error: { code: 'network-error', message: "The server could not be reached, check your connectivity" }
                })
                return;
            }

            const message = e instanceof Error ? e.message : 'An unhandled error occurred';
            dispatch({ type: 'failed-upload', error: { code: 'unknown-error', message: message } })
        }
    }

    function handleFilesSelected(files: File[]) {
        if (!files || files.length == 0) return;
        dispatch({ type: 'selected-file', files: files });
    }

    if (state.status == 'idle') {
        const stagedFiles = state.stagedFiles ?? [];
        return (
            <div className={styles.uploadBox}>
                <Card>
                    <FileDropzone onFilesDropped={handleFilesSelected}>
                        <SelectFile key={stagedFiles.length} onFilesSelected={handleFilesSelected} />
                    </FileDropzone>
                    <SelectedFileList files={stagedFiles} onDelete={(file) => {
                        dispatch({ type: 'deleted-file', file: file })
                    }} />
                </Card>
                <Button onClick={() => handleUpload(state.stagedFiles ?? [])}
                    className={styles.uploadButton}
                    visible={(state.stagedFiles?.length ?? 0) > 0}
                    label='Upload' />
            </div >
        )
    }

    if (state.status === 'encrypting' || state.status == 'done') {

        return (
            <>
                <Card className={styles.visualArea}>
                    <div className={`${styles.layer} ${state.status !== 'encrypting' ? styles.hidden : ''}`}>
                        <EncryptingIndicator />
                    </div>
                    <div className={`${styles.layer} ${state.status !== 'done' ? styles.hidden : ''}`}>
                        <QRCodeDisplay url={state.status === 'done' ? state.qrUrl : ''} />
                    </div>

                </Card>
                <div className={`${styles.documentId} ${state.status !== 'done' ? styles.hidden : ''}`} >
                    <span >{`${state.status === 'done' ? new URL(state.qrUrl).pathname.split('/').at(-1) : ''}`}</span>
                </div>
            </>
        )
    }

    if (state.status == 'error') {
        return (
            <Card variant="danger">
                <ErrorDisplay error={state.error} />
            </Card>
        )
    }

    return (
        <Card variant="danger">
            <ErrorDisplay error={{ code: "unknown-error", message: "It's okay to be lost sometimes..." }} />
        </Card>
    )
}

function reducer(state: UploadState, action: UploadAction): UploadState {
    switch (action.type) {
        case 'selected-file': {
            return {
                status: 'idle',
                stagedFiles: action.files
            }
        }

        case 'encrypted-file': {
            return {
                status: 'encrypting'
            }
        }


        case 'succeeded-upload': {
            return {
                status: 'done',
                qrUrl: action.qrUrl
            }
        }

        case 'deleted-file': {
            if (state.status !== 'idle') return state;
            return {
                status: 'idle',
                stagedFiles: state.stagedFiles?.filter(file => file.name !== action.file.name)
            }
        }

        case 'failed-upload': {
            return {
                status: 'error',
                error: action.error
            }
        }

    }
}




export default UploadPage;