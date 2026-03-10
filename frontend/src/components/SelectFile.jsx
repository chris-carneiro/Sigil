import { useState } from "react";

function SelectFile() {
    const [file, setFile] = useState(null);


    return (
        <div>
             <input type="file" onChange={e => setFile(e.target.files[0])} ></input>
        </div>
    );
}

export default SelectFile;