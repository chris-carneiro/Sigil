import { useState } from "react";


function SelectFile({ onFileSelected }) {
    const [file, setFile] = useState(null);


    return (
        <div>
            <input type="file" onChange={e => setFile(e.target.files[0])} />
            <input type="button" onClick={() => {
                console.log("path", window.location.pathname);
                onFileSelected(file)
            }} value="Upload" />
        </div>
    );
}

export default SelectFile;