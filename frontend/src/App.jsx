import './App.css'
import SelectFile from './components/SelectFile'
import encrypt from './secure/encryption';

function App() {
  return (
    <>
      <SelectFile onFileSelected={handleFile} />
    </>
  )
}

async function handleFile(file) {
  console.log(file.name);
  const {cipherText, rawKey, iv} = await encrypt(file);

  const formData = new FormData();
  formData.append("document", new Blob([cipherText]));


  const response = await fetch('/api/v1/documents', {
    method: 'POST',
    body: formData
  });

  const body = await response.json()
  console.log("Response body=", body.documentId);
}

export default App
