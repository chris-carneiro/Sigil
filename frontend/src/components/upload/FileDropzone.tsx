import { DragEvent, useState } from 'react';
import styles from './FileDropzone.module.css';

type FileDropzoneProps = {
    onFilesDropped: (files: File[]) => void;
    children: React.ReactNode;
};

export function FileDropzone({ onFilesDropped, children }: FileDropzoneProps) {
    const [isDragOver, setIsDragOver] = useState(false);

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragOver(false);
        const files: File[] = Array.from(event.dataTransfer.files);
        if (files.length > 0) {
            onFilesDropped(files);
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            // Focus the file input if available
            const fileInput = document.getElementById('file-upload');
            if (fileInput) {
                (fileInput as HTMLElement).focus();
            }
        }
    }

    return (
        <div
            className={`${styles.dropzone} ${isDragOver ? styles.dragover : ''}`}
            id='drop-target'
            role='region'
            aria-label='File drop zone'
            tabIndex={0}
            onDragOver={(event) => {
                event.preventDefault();
            }}
            onDragEnter={() => {
                setIsDragOver(true);
            }}
            onDragLeave={(event) => {
                if (
                    event.relatedTarget === null ||
                    !event.currentTarget.contains(event.relatedTarget as Node)
                ) {
                    setIsDragOver(false);
                }
            }}
            onDrop={handleDrop}
            onKeyDown={handleKeyDown}
        >
            {children}
        </div>
    );
}
