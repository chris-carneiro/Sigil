import { useReducer } from 'react';
import SelectFile from './SelectFile';
import styles from './UploadPage.module.css';
import { buildEnvelope } from '../../crypto/envelope';
import { encrypt } from '../../crypto/encrypt';
import { postDocument as uploadDocument } from '../../api/documents';
import { QRCodeSVG } from 'qrcode.react';
import sigilLogo from '../../assets/sigil_mark_light.svg';
import { Card } from '../common/Card';
import { ErrorDisplay } from '../common/ErrorDisplay';
import { AppError } from '../../types';

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

    function handleFilesSelected(files: File[]) {
        if (!files || files.length == 0) return;
        dispatch({ type: 'selected-file', files: files });

        handleFile(files)
    }

    if (state.status == 'idle') {
        return (
            <Card>
                <SelectFile onFilesSelected={handleFilesSelected} />
            </Card>
        )
    }

    if (state.status == 'encrypting') {
        return (<div className={styles.card}>
            <p>Encrypting...</p>
        </div>)
    }

    if (state.status == 'done') {
        return (
            <Card>
                <QRCodeSVG
                    value={state.qrUrl}
                    title="Scan to download private document"
                    size={512}
                    bgColor={"#F7F8F8"}
                    fgColor={"#37ACA8"}
                    level={"H"}
                    imageSettings={{
                        src: sigilLogo,
                        height: 128,
                        width: 128,
                        opacity: 1,
                        excavate: true,
                    }} />
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