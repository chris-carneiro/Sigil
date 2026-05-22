import { useState } from 'react';
import { Button } from './Button';
import styles from './ShareActions.module.css';
import { ClipboardCopy } from './ClipboardCopy';

type ShareActionsProps = {
    url: string;
    className?: string;
};

export function ShareActions({ url, className }: ShareActionsProps) {
    const handleShare = async () => {
        await navigator.share({ url, title: 'Secure document' });
    };

    return (
        <div className={`${styles.container} ${className ?? ''}`}>
            <ClipboardCopy label='Copy link to clipboard' textCopy={url} />
            {'share' in navigator && (
                <Button
                    label={
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                            fill='none'
                        >
                            <path
                                d='M8 1L8 10M8 1L5 4M8 1L11 4'
                                stroke='var(--color-accent)'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                            <path
                                d='M3 8V13H13V8'
                                stroke='var(--color-accent)'
                                strokeWidth='1.5'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    }
                    onClick={handleShare}
                    className={styles.iconButton}
                />
            )}
        </div>
    );
}
