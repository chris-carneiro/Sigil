import { useState } from "react";
import styles from './SelectFile.module.css';

function SelectFile({ onFileSelected }) {
    const [file, setFile] = useState(null);


    return (
        <div>
            <input type="file" onChange={e => setFile(e.target.files[0])} />
            <button className={styles.button} type="button" onClick={() => {
                onFileSelected(file)
            }} value="Upload">Upload</button>
        </div>
    );
}

export default SelectFile;