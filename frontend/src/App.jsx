import { useState } from 'react';
import './App.css'
import SelectFile from './components/SelectFile'
import encrypt from './secure/encryption';
import QRCode from 'react-qr-code';


function App() {
  const [qrCodeUrl, setQRCodeUrl] = useState(null);

  async function handleFile(file) {
    const { cipherText, rawKey, iv } = await encrypt(file);

    const formData = new FormData();
    formData.append("document", new Blob([cipherText]));


    const response = await fetch('/api/v1/documents', {
      method: 'POST',
      body: formData
    });

    const body = await response.json()
    const encodedKey = new Uint8Array(rawKey).toBase64({ alphabet: "base64url", omitPadding: true });
    const qrUrl = `${window.location.origin}/api/v1/documents/${body.documentId}#${encodedKey}`;

    setQRCodeUrl(qrUrl);

  }
  if (qrCodeUrl) return <QRCode value={qrCodeUrl} />

  return (
    <>
      <SelectFile onFileSelected={handleFile} />
    </>
  )
}



export default App
