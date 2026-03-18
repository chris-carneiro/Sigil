import { useEffect, useState } from 'react';
import './App.css'
import SelectFile from './components/SelectFile'
import encrypt, { decrypt } from './secure/encryption';
import './secure/encryption'
import { QRCodeSVG } from 'qrcode.react';
import sigilLogo from './assets/sigil_mark.svg';


function App() {
  const [qrCodeUrl, setQRCodeUrl] = useState(null);
  const [hasError, setError] = useState(null);

  async function handleFile(file) {
    const { cipherText, rawKey, iv } = await encrypt(file);

    const formData = new FormData();
    formData.append("document", new Blob([cipherText], { type: file.type }), file.name);
    formData.append("iv", new Blob([iv], { type: "application/octet-stream" }));

    try {
      const response = await fetch('/api/v1/documents', {
        method: 'POST',
        body: formData
      });



      if (!response.ok) {
        throw Error("The encrypted document could not be stored")
      }

      const body = await response.json()
      const encodedKey = new Uint8Array(rawKey).toBase64({ alphabet: "base64url", omitPadding: true });
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
      return [documentId, key];
    }

    return [];
  }

  useEffect(() => {
    async function downloadDocument() {
      try {
        const [documentId, key] = parseMetadata();
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
          const plainText = await decrypt(encryptedBytes, decodedKey, decodedIv);

          // console.log("decrypted text=", new TextDecoder().decode(plainText));

          const contentDisposition = response.headers.get("content-disposition");

          let fileNameValue = "unknown";
          const searchKey = "filename=";

          if (contentDisposition && contentDisposition.includes(searchKey)) {
            fileNameValue = contentDisposition.substring(contentDisposition.search(searchKey) + searchKey.length).replaceAll('"', '');
          }

          const blobUrl = URL.createObjectURL(new Blob([plainText]));

          const downloadLink = document.createElement("a");
          downloadLink.href = blobUrl;
          downloadLink.download = fileNameValue;
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
    size={256}
    bgColor={"#ffffff"}
    fgColor={"#000000"}
    level={"H"}
    imageSettings={{
      src: sigilLogo,
      height: 56,
      width: 56,
      opacity: 1,
      excavate: true,
    }}
  />



  return (
    <>
      {hasError && <p className="error">{hasError}</p>}
      <SelectFile onFileSelected={handleFile} />
    </>)
}




export default App
