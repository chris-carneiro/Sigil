import { useState } from 'react';
import './App.css'
import SelectFile from './components/SelectFile'
import encrypt from './secure/encryption';
import { QRCodeSVG } from 'qrcode.react';
import sigilLogo from './assets/sigil_mark.svg';




function App() {
  const [qrCodeUrl, setQRCodeUrl] = useState(null);
  const [hasError, setError] = useState(null);

  async function handleFile(file) {
    const { cipherText, rawKey, iv } = await encrypt(file);

    const formData = new FormData();
    formData.append("document", new Blob([cipherText]));


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
      const qrUrl = `${window.location.origin}/api/v1/documents/${body.documentId}#${encodedKey}`;

      setQRCodeUrl(qrUrl);
    } catch (e) {
      if (e instanceof TypeError) {
        setError("The server could not be reached, check your connectivity")
        return;
      }
      setError(e.message)
    }


  }

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
    </>
  )
}



export default App
