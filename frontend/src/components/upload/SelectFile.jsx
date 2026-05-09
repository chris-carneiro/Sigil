import styles from './SelectFile.module.css';
import { useRef } from "react";

function SelectFile({ onFileSelected }) {

    const inputRef  = useRef(null);

    function handleSelectedFiles() {
        console.log("ref current", inputRef.current);
        const input = inputRef.current;
        if (!input) {
            return;
        }
        onFileSelected(input.files)
    }

    return (
        <div>
            <input ref={inputRef} type="file"/>
            <button className={styles.button} type="button"
                onClick={handleSelectedFiles} value="Upload">Upload</button>
        </div>
    );
}

export default SelectFile;