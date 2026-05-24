import styles from './DocumentId.module.css';

type DocumentIdProps = {
    className?: string;
    documentId?: string;
};

export function DocumentId (props: DocumentIdProps) {
    return (
        <div className={`${styles.documentId} ${props.className ?? ''}`}>
            <span>{props.documentId}</span>
        </div>
    );
}
