import { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import styles from './ClipboardCopy.module.css';

type CopyButtonProps = {
    label?: React.ReactNode;
    textCopy: string;
    className?: string;
};

export function ClipboardCopy({ label, textCopy, className, ...rest }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleCopy = async () => {
        setError(null);
        try {
            await navigator.clipboard.writeText(textCopy);
            setCopied(true);
            timeoutRef.current = setTimeout(() => {
                setCopied(false);
            }, 3000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to copy to clipboard';
            setError(errorMessage);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setError(null);
            }, 3000);
        }
    };

    return (
        <div className={`${styles.container} ${className ?? ''}`}>
            <span>{label}</span>
            <Button
                {...rest}
                label={
                    copied ? (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                            fill='none'
                        >
                            <path
                                d='M2 8L6 12L14 4'
                                stroke='var(--color-accent)'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    ) : error ? (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                            fill='none'
                        >
                            <circle
                                cx='8'
                                cy='8'
                                r='7'
                                stroke='var(--color-error)'
                                strokeWidth='1.5'
                            />
                            <path
                                d='M5 5L11 11M11 5L5 11'
                                stroke='var(--color-error)'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                            fill='none'
                        >
                            <rect
                                x='1'
                                y='5'
                                width='10'
                                height='10'
                                rx='2'
                                stroke='var(--color-accent)'
                                strokeWidth='1.5'
                            />
                            <rect
                                x='5'
                                y='1'
                                width='10'
                                height='10'
                                rx='2'
                                fill='var(--color-surface)'
                                stroke='var(--color-accent)'
                                strokeWidth='1.5'
                            />
                        </svg>
                    )
                }
                onClick={handleCopy}
                className={styles.iconButton}
                aria-label={error ? 'Copy failed' : copied ? 'Copied' : 'Copy to clipboard'}
            />
            {error && <span className={styles.error} role='alert'>{error}</span>}
        </div>
    );
}
