import styles from './QRCodeDisplay.module.css';
import sigilLogo from '../../assets/sigil_mark_light.svg';
import { QRCodeSVG } from 'qrcode.react';

type QRCodeDisplayProps = {
    url: string;
};

export function QRCodeDisplay({ url }: QRCodeDisplayProps) {
    if (!url) return null;

    const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent')
        .trim();
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();
    return (
        <>
            <div className={styles.container} aria-label='QR code for document download'>
                <QRCodeSVG
                    value={url}
                    title='Scan to download private document'
                    size={280}
                    style={{ width: '100%', aspectRatio: '1' }}
                    bgColor={bg}
                    fgColor={accent}
                    level={'H'}
                    imageSettings={{
                        src: sigilLogo,
                        height: 68,
                        width: 68,
                        opacity: 1,
                        excavate: true,
                    }}
                />
            </div>
        </>
    );
}
