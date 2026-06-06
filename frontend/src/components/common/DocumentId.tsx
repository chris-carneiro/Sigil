import type { JSX } from 'react';
import styles from './DocumentId.module.css';

type DocumentIdProps = {
    className?: string;
    documentId?: string;
};

export function DocumentId({ className, documentId }: DocumentIdProps): JSX.Element {
    return (
        <div className={`${styles.documentId} ${className ?? ''}`}>
            <span>{documentId ?? 'N/A'}</span>
        </div>
    );
}
