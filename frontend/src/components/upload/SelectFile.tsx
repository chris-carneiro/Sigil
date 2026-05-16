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
        <div className={styles.container}>
            <label className={styles.label}>
                Drop files here, or click to upload.
                <input className={styles.fileInput} ref={inputRef} type="file"
                    onChange={handleSelectedFiles} />
            </label>
        </div>
    );
}

export default SelectFile;