import styles from './SelectedFileList.module.css'

type SelectedFileListProps = {
    files: File[];
    onDelete: (file: File) => void
}

export function SelectedFileList(props: SelectedFileListProps) {
    const files = props.files;
    const singleFile = files ? files[0] : undefined ; // Only single file upload is supported in MVP. 
    if (!singleFile) return;

    function handleDelete(file: File) {
        return () => props.onDelete(file);
    }

    function truncateMiddle(filename: string): string {
        const maxLength: number = 20;

        if (filename.length >= maxLength) {
            const firstHalf = filename.slice(0, Math.floor(maxLength / 2))
            const lastHalf = filename.slice(filename.length - Math.ceil(maxLength / 2))

            const truncatedFilename = firstHalf + ' \u2026 ' + lastHalf;
            return truncatedFilename;
        }
        return filename;
    }


    return (
        <ul className={styles.fileList}>
            <li key={singleFile.name} className={styles.listItem}>
                <span>{truncateMiddle(singleFile.name)}</span>
                <button className={styles.button} onClick={handleDelete(singleFile)}>X</button>
            </li>
        </ul>
    )
}