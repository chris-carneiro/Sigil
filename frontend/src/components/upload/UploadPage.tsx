import { useReducer } from 'react';
import SelectFile from './SelectFile';
import { Card } from '../common/Card';
import { ErrorDisplay } from '../common/ErrorDisplay';
import { AppError } from '../../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { FileDropzone } from './FileDropzone';
import { Button } from '../common/Button';
import styles from './UploadPage.module.css';
import { SelectedFileList } from './SelectedFileList';
import { SigilIndicator } from '../common/SigilIndicator';
import { withMinimumDuration } from '../../utils/async';
import { DocumentId } from '../common/DocumentId';
import { ShareActions } from '../common/ShareActions';
import { uploadFile } from '../../usecase/uploadFile';
import { uploadError } from '../../api/errors';

type UploadState =
    | { status: 'idle'; stagedFiles?: File[] }
    | { status: 'encrypting' }
    | { status: 'done'; qrUrl: string }
    | { status: 'error'; error: AppError };

type UploadAction =
    | { type: 'selected-file'; files: File[] }
    | { type: 'encrypted-file' }
    | { type: 'succeeded-upload'; qrUrl: string }
    | { type: 'deleted-file'; file: File }
    | { type: 'failed-upload'; error: AppError };

const initialState: UploadState = { status: 'idle' };

function UploadPage () {
    const [state, dispatch] = useReducer(reducer, initialState);

    async function handleUpload (files: File[]) {
        dispatch({ type: 'encrypted-file' });
        try {
            const qrUrl = await withMinimumDuration(
                uploadFile({
                    files: files,
                    urlOrigin: window.location.origin,
                }),
                1500,
            );

            dispatch({ type: 'succeeded-upload', qrUrl });
        } catch (e: unknown) {
            dispatch({ type: 'failed-upload', error: uploadError(e) });
        }
    }

    function handleFilesSelected (files: File[]) {
        if (!files || files.length == 0) return;
        dispatch({ type: 'selected-file', files: files });
    }

    if (state.status == 'idle') {
        const stagedFiles = state.stagedFiles ?? [];
        return (
            <div className={styles.uploadBox}>
                <Card className={styles.uploadCard}>
                    <FileDropzone onFilesDropped={handleFilesSelected}>
                        <SelectFile
                            key={stagedFiles.length}
                            onFilesSelected={handleFilesSelected}
                        />
                    </FileDropzone>
                    <SelectedFileList
                        files={stagedFiles}
                        onDelete={(file) => {
                            dispatch({ type: 'deleted-file', file: file });
                        }}
                    />
                </Card>
                <div
                    className={`${styles.buttonContainer} ${(state.stagedFiles?.length ?? 0) > 0 ? '' : styles.hidden}`}
                >
                    <Button
                        onClick={() => handleUpload(state.stagedFiles ?? [])}
                        className={styles.uploadButton}
                        label='Upload'
                    />
                </div>
            </div>
        );
    }

    if (state.status == 'error') {
        return (
            <Card variant='danger'>
                <ErrorDisplay error={state.error} />
            </Card>
        );
    }

    if (state.status === 'encrypting') {
        return (
            <Card className={styles.visualArea}>
                <div className={styles.layer}>
                    <SigilIndicator label='Encrypting...' alt='Encrypting before uploading.' />
                </div>
            </Card>
        );
    }

    if (state.status === 'done') {
        const documentId = new URL(state.qrUrl).pathname.split('/').at(-1) ?? '';

        return (
            <>
                <div className={styles.warnUser}>
                    <span>
                        This link decrypts your file — only share it with the intended trusted
                        recipient.
                    </span>

                    <span>
                        This QR code & link are only shown once — make sure to save them before
                        leaving this page
                    </span>
                </div>

                <Card className={styles.visualArea}>
                    <div className={styles.layer}>
                        <QRCodeDisplay url={state.qrUrl} />
                    </div>
                </Card>

                <DocumentId documentId={documentId} />

                <ShareActions url={state.qrUrl} />
            </>
        );
    }
}

function reducer (state: UploadState, action: UploadAction): UploadState {
    switch (action.type) {
        case 'selected-file': {
            return {
                status: 'idle',
                stagedFiles: action.files,
            };
        }

        case 'encrypted-file': {
            return {
                status: 'encrypting',
            };
        }

        case 'succeeded-upload': {
            return {
                status: 'done',
                qrUrl: action.qrUrl,
            };
        }

        case 'deleted-file': {
            if (state.status !== 'idle') return state;
            return {
                status: 'idle',
                stagedFiles: state.stagedFiles?.filter((file) => file.name !== action.file.name),
            };
        }

        case 'failed-upload': {
            return {
                status: 'error',
                error: action.error,
            };
        }
        default:
            return state;
    }
}

export default UploadPage;
