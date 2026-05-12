import { useReducer } from 'react';
import SelectFile from './SelectFile';
import styles from './UploadPage.module.css';
import { buildEnvelope } from '../../crypto/envelope';
import { encrypt } from '../../crypto/encrypt';
import { postDocument as uploadDocument } from '../../api/documents';
import { QRCodeSVG } from 'qrcode.react';
import sigilLogo from '../../assets/sigil_mark_light.svg';

type UploadState =
    | { status: 'idle' }
    | { status: 'encrypting' }
    | { status: 'done'; qrUrl: string }

type UploadAction =
    | { type: "selected-file"; files: File[] }
    | { type: "succeeded-upload"; qrUrl: string }
    | { type: "failed-upload"; message: string }

const initialState: UploadState = { status: 'idle' };


function UploadPage() {

    const [state, dispatch] = useReducer(reducer, initialState);

    async function handleFile(files: File[]) {
        console.log("files", files);
        if (!files || files.length == 0) return;
        const firstFile = files[0];
        console.log("firstFile", firstFile);
        if (!firstFile || !firstFile.name) return;

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
        } catch (e: any) {
            if (e instanceof TypeError) {

                dispatch({ type: 'failed-upload', message: "The server could not be reached, check your connectivity" })
                return;
            }

            dispatch({ type: 'failed-upload', message: e.message })
        }
    }

    function handleFilesSelected(files: File[]) {
        dispatch({ type: 'selected-file', files: files });

        handleFile(files)
    }

    if (state.status == 'idle') {
        return (
            <div className={styles.card}>
                <SelectFile onFilesSelected={handleFilesSelected} />
            </div>
        )
    }

    if (state.status == 'encrypting') {
        return (<div className={styles.card}>
            <p>Encrypting...</p>
        </div>)
    }

    if (state.status == 'done') {
        return (
            <div className={styles.card}>
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
            </div>
        )
    }

    return (
        <div className={styles.card}>It's okay to be lost sometimes...</div>
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
                status: 'idle'
            }
        }
    }
}




export default UploadPage;