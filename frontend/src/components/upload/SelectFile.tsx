import styles from './SelectFile.module.css';
import { useRef } from "react";

type SelectFileProps = {
    onFilesSelected: (files: File[]) => void
}


function SelectFile({ onFilesSelected }: SelectFileProps) {

    const inputRef = useRef<HTMLInputElement>(null);

    function handleSelectedFiles() {
        const input = inputRef.current;

        if (!input || !input.files) {
            return;
        }
        const files: File[] = Array.from(input.files);
        onFilesSelected(files)
    }

    return (
        <div>
            <input ref={inputRef} type="file" />
            <button className={styles.button} type="button"
                onClick={handleSelectedFiles} >Upload</button>
        </div>
    );
}

export default SelectFile;