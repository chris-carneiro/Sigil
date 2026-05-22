import { truncateMiddle } from '../../utils/strings';
import styles from './SelectedFileList.module.css';

type SelectedFileListProps = {
    files: File[];
    onDelete: (file: File) => void;
};

export function SelectedFileList(props: SelectedFileListProps) {
    const files = props.files;
    const singleFile = files ? files[0] : undefined; // Only single file upload is supported in MVP.
    if (!singleFile) return;

    function handleDelete(file: File) {
        return () => props.onDelete(file);
    }

    return (
        <ul className={styles.fileList}>
            <li key={singleFile.name} className={styles.listItem}>
                <span>{truncateMiddle(singleFile.name)}</span>
                <button className={styles.button} onClick={handleDelete(singleFile)}>
                    X
                </button>
            </li>
        </ul>
    );
}
