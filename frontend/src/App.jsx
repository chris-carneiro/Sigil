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
  console.log("cipher", new Uint8Array(cipherText).toBase64({ alphabet: "base64url" }));
}

export default App
