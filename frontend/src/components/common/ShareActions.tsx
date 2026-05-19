import { useState } from 'react';
import { Button } from './Button';
import styles from './ShareActions.module.css';

type ShareActionsProps = {
    url: string;
    className?: string;
}

export function ShareActions({ url, className }: ShareActionsProps) {
    const [copied, setCopied] = useState(false)
    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000)
    };

    const handleShare = async () => {
        await navigator.share({ url, title: 'Secure document' });
    };

    return (
        <div className={`${styles.container} ${className ?? ''}`}>
            <span>Copy link to clipboard</span>
            <Button
                label={copied ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8L6 12L14 4" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"
                            strokeLinejoin="round" />
                    </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="1" y="5" width="10" height="10" rx="2" stroke="var(--color-accent)" strokeWidth="1.5" />
                        <rect x="5" y="1" width="10" height="10" rx="2" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="1.5" />
                    </svg>}

                onClick={handleCopy}
                className={styles.iconButton}
            />
            {'share' in navigator && (
                <Button label={
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1L8 10M8 1L5 4M8 1L11 4" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 8V13H13V8" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                } onClick={handleShare} className={styles.iconButton} />
            )}
        </div>
    );
}
