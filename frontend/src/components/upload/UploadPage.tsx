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

type UploadState =
    | { status: 'idle' }
    | { status: 'encrypting' }
    | { status: 'done'; qrUrl: string }
    | { status: 'error'; error: AppError }

type UploadAction =
    | { type: "selected-file"; files: File[] }
    | { type: "succeeded-upload"; qrUrl: string }
    | { type: "failed-upload"; error: AppError }

const initialState: UploadState = { status: 'idle' };


function UploadPage() {

    const [state, dispatch] = useReducer(reducer, initialState);

    async function handleFile(files: File[]) {
        const firstFile = files[0];

        console.log("firstFile", firstFile);

        if (!firstFile || !firstFile.name) {
            throw new Error('Invalid file name');
        }

        try {
            const fileSizeLimit = 10000000;
            if (firstFile.size > fileSizeLimit) throw new Error("File is too large");

            const envelope = await buildEnvelope(firstFile);
            const { cipherText, rawKey, iv } = await encrypt(envelope);

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

    async function handleFilesSelected(files: File[]) {
        if (!files || files.length == 0) return;
        dispatch({ type: 'selected-file', files: files });

        await handleFile(files)
    }

    if (state.status == 'idle') {
        return (
            <Card>
                <FileDropzone onFilesSelected={handleFilesSelected}>
                    <SelectFile onFilesSelected={handleFilesSelected} />
                </FileDropzone>
            </Card>
        )
    }

    if (state.status == 'encrypting') {
        return (
            <Card>
                <p>Encrypting...</p>
            </Card>
        )
    }

    if (state.status == 'done') {
        return (
            <Card>
                <QRCodeDisplay url={state.qrUrl} />
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
                status: 'encrypting'
            }
        }
        case 'succeeded-upload': {
            return {
                status: 'done',
                qrUrl: action.qrUrl
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