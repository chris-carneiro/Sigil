import { useEffect, useState } from 'react';
import SelectFile from './components/upload/SelectFile'
import { decrypt } from './crypto/decrypt';
import { encrypt } from './crypto/encrypt'
import { QRCodeSVG } from 'qrcode.react';
import sigilLogo from './assets/sigil_mark_light.svg';
import TopBar from './components/layout/TopBar';
import Main from './components/layout/Main';
import UploadPage from './components/upload/UploadPage';
import { buildEnvelope, openEnvelope } from './crypto/envelope'

function App() {
  const [qrCodeUrl, setQRCodeUrl] = useState(null);
  const [hasError, setError] = useState(null);


  async function handleFile(files) {
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


      const response = await fetch('/api/v1/documents', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        console.log("res", response)
        throw Error("The encrypted document could not be stored")
      }

      const body = await response.json()
      const encodedKey = new Uint8Array(rawKey).toBase64({ alphabet: "base64url", omitPadding: true });
      Uint8Array(rawKey).fill(0);
      const qrUrl = `${window.location.origin}/documents/download/${body.documentId}#${encodedKey}`;

      setQRCodeUrl(qrUrl);
    } catch (e) {
      if (e instanceof TypeError) {
        setError("The server could not be reached, check your connectivity")
        return;
      }
      setError(e.message)
    }
  }

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
          const response = await fetch('/api/v1/documents/' + documentId, {
            method: 'GET'
          });

          if (!response.ok) {
            throw Error("The encrypted document could not be fetched");
          }

          const encryptedBytes = await response.arrayBuffer();
          const iv = response.headers.get("encryption-metadata-iv");
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



  if (qrCodeUrl) return <QRCodeSVG
    value={qrCodeUrl}
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
    }}
  />



  return (
    <>
      <TopBar />
      {hasError && <p className="error">{hasError}</p>}
      <Main>
        <UploadPage>
          <SelectFile onFilesSelected={handleFile} />
        </UploadPage>
      </Main>
    </>)
}




export default App
