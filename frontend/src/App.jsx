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


  async function buildEnvelope(file) {
    if (!isAscii(file)) {
      throw new Error("The file name format is not supported, use only alphanumeric characters");
    }

    const fileNameLimit = 255;
    if (file.name.length > fileNameLimit) {
      throw new Error("The file name is too long > " + fileNameLimit);
    }

    const headerLength = 4;
    const metadata = JSON.stringify({ "fileName": file.name, "mimeType": file.type || "application/octet-stream" });

    const jsonMetadata = buildJsonMetadata();
    const fileBytes = await buildFileBytes();
    const header = buildHeader(jsonMetadata.length);

    // building envelope
    const envelopeLength = headerLength + jsonMetadata.length + fileBytes.length;
    const envelope = new Uint8Array(envelopeLength);

    envelope.set(header);
    envelope.set(jsonMetadata, headerLength);
    envelope.set(fileBytes, headerLength + jsonMetadata.length);

    return envelope;

    function isAscii(file) {
      return new TextEncoder().encode(file.name).length == file.name.length;
    }

    async function buildFileBytes() {
      const fileBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(fileBuffer);
      return fileBytes;
    }

    function buildJsonMetadata() {
      const textEncoder = new TextEncoder();
      const jsonMetadata = textEncoder.encode(metadata);
      return jsonMetadata;
    }

    function buildHeader(metadataLength) {
      const headerBuffer = new ArrayBuffer(4);
      const view = new DataView(headerBuffer);
      view.setUint32(0, metadataLength);
      const header = new Uint8Array(headerBuffer);
      return header;
    }
  }

  async function handleFile(file) {
    if (!file || !file.name) return;
    try {
      const fileSizeLimit = 10000000;
      if (file.size > fileSizeLimit) throw new Error("File is too large");

      const envelope = await buildEnvelope(file);
      const { cipherText, rawKey, iv } = await encrypt(envelope);

      const formData = new FormData();

      formData.append("document", new Blob([cipherText], { type: "application/octet-stream" }));
      formData.append("iv", new Blob([iv], { type: "application/octet-stream" }));


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

          const { jsonMetadata, fileBytes } = splitEnvelope(envelop);

          const blobUrl = URL.createObjectURL(new Blob([fileBytes], { type: jsonMetadata.mimeType }));

          const downloadLink = document.createElement("a");
          downloadLink.href = blobUrl;
          downloadLink.download = jsonMetadata.fileName;
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

      function splitEnvelope(decryptedEnvelope) {
        try {
          const metadataStartIndex = 4;
          const envelopeBytes = new Uint8Array(decryptedEnvelope);
          const metadataLength = envelopeBytes.subarray(0, metadataStartIndex);

          // extracts metadata array length as integer value.
          const metadataSize = new DataView(metadataLength.buffer, metadataLength.byteOffset, metadataLength.byteLength).getUint32(0);
          const metadataEndIndex = metadataStartIndex + metadataSize;
          if (metadataEndIndex > envelopeBytes.length) throw new Error("Envelope format violation detected");

          const jsonBytes = envelopeBytes.subarray(metadataStartIndex, metadataEndIndex);
          const jsonMetadata = JSON.parse(new TextDecoder().decode(jsonBytes));

          const fileBytes = envelopeBytes.subarray(metadataEndIndex);

          return { jsonMetadata, fileBytes };
        } catch (e) {

          throw new Error(e.message || "Error spliting envelope");
        }
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
