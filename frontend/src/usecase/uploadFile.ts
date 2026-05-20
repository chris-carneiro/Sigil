import {buildEnvelope} from '../crypto/envelope';
import {encrypt} from '../crypto/encrypt';
import {postDocument as uploadDocument} from '../api/documents';

const applicationOctetStream = "application/octet-stream";
const fileSizeLimit = 10000000;

interface UploadParams {
    files: File[],
    urlOrigin: string
}

export async function uploadFile(params: UploadParams) {

    const firstFile = params.files?.[0];

    if (!firstFile?.name) {
        throw Error("Invalid file");
    }

    if (firstFile.size > fileSizeLimit) {
        throw Error("File is too large");
    }

    const envelope = await buildEnvelope(firstFile);
    const {cipherText, rawKey, rawIV} = await encrypt(envelope);

    const formData = new FormData();
    const encryptedDocument = new Blob([cipherText], {type: applicationOctetStream});
    const iv = new Blob([rawIV], {type: applicationOctetStream});
    formData.append("document", encryptedDocument);
    formData.append("iv", iv);

    const {documentId} = await uploadDocument(formData);

    const encodedKey = new Uint8Array(rawKey).toBase64({alphabet: "base64url", omitPadding: true});

    new Uint8Array(rawKey).fill(0);

    return `${params.urlOrigin}/documents/download/${documentId}#${encodedKey}`;
}
