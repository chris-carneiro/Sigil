import { useState } from 'react';
import { Button } from './Button';
import styles from './ClipboardCopy.module.css';

type CopyButtonProps = {
    label?: React.ReactNode;
    textCopy: string;
    className?: string;
};

export function ClipboardCopy({ label, textCopy, className, ...rest }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(textCopy);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000);
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
            />
        </div>
    );
}
