import { useEffect, useState } from 'react';
import { decrypt } from './crypto/decrypt';
import TopBar from './components/layout/TopBar';
import Main from './components/layout/Main';
import UploadPage from './components/upload/UploadPage';
import {  openEnvelope } from './crypto/envelope'
import { getDocument as fetchDocument } from './api/documents';

function App() {
  const [hasError, setError] = useState(null);

  function parseMetadata() {

    const path = window.location.pathname;
    const fragment = window.location.hash;

    if (path.includes("/documents/download") && fragment) {
      const pathEnd = path.lastIndexOf("/");
      const documentId = path.substring(pathEnd + 1);
      const key = fragment.substring(fragment.lastIndexOf('#') + 1);
      return { documentId, key };
    }

    return {};
  }

  useEffect(() => {
    async function downloadDocument() {
      try {
        const { documentId, key } = parseMetadata();
        if (documentId) {

          const { encryptedBytes, base64EncodedIV: iv } = await fetchDocument(documentId);

          const decodedKey = Uint8Array.fromBase64(key, { alphabet: "base64url", omitPadding: true });
          const decodedIv = Uint8Array.fromBase64(iv);
          const envelop = await decrypt(encryptedBytes, decodedKey, decodedIv);

          const { metadata, rawFile: data } = openEnvelope(envelop);

          const blobUrl = URL.createObjectURL(new Blob([data], { type: metadata.mimeType }));

          const downloadLink = document.createElement("a");
          downloadLink.href = blobUrl;
          downloadLink.download = metadata.fileName;
          downloadLink.click();
          URL.revokeObjectURL(blobUrl);
        }
      } catch (e) {
        if (e instanceof TypeError) {
          setError("The server returned invalid data, the document could not be recovered");
          return;
        }

        if (e instanceof DOMException && e.name === "OperationError") {
          setError("The document could not be recovered using the provided cryptographic properties");
          return;
        }

        setError(e.message ? e.message : "An unhandled error occured=" + e.constructor.name);
      }
    }

    downloadDocument();
  }, []);

  return (
    <>
      <TopBar />
      {hasError && <p className="error">{hasError}</p>}
      <Main>
        <UploadPage />
      </Main>
    </>)
}

export default App
