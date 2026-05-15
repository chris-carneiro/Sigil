import { useState } from "react";
import styles from './FileDropzone.module.css'


type FileDropzoneProps = {
    onFilesSelected: (files: File[]) => void;
    children: React.ReactNode
}

export function FileDropzone(props: FileDropzoneProps) {
    const [isDragOver, setIsDragOver] = useState(false);

    function handleDrop(event: React.DragEvent) {
        event.preventDefault();
        setIsDragOver(false);
        const files: File[] = Array.from(event.dataTransfer.files);
        if (files.length > 0) {
            props.onFilesSelected(files);
        }

    }
    return (
        <div className={`${styles.dropzone} ${isDragOver ? styles.dragover : ''}`} id="drop-target"
            onDragOver={(event) => {
                event.preventDefault();
            }}
            onDragEnter={(event) => {
                setIsDragOver(true);
            }}

            onDragLeave={(event) => {
                if (event.relatedTarget === null || !event.currentTarget.contains(event.relatedTarget as Node)) {
                    setIsDragOver(false);
                }
            }}
            onDrop={handleDrop}
        >
            {props.children}
        </div>
    )
} 