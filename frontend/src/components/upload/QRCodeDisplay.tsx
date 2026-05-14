import styles from './QRCodeDisplay.module.css'
import sigilLogo from '../../assets/sigil_mark_light.svg';
import { QRCodeSVG } from 'qrcode.react';

type QRCodeDisplayProps = {
    url: string
}

export function QRCodeDisplay(props: QRCodeDisplayProps) {

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();

    const documentId = new URL(props.url).pathname.split('/').at(-1);

    return (
        <>
            <div className={styles.container}>
                <QRCodeSVG
                    value={props.url}
                    title="Scan to download private document"
                    size={512}
                    style={{ width: '80%', height: 'auto' }}
                    bgColor={bg}
                    fgColor={accent}
                    level={"H"}
                    imageSettings={{
                        src: sigilLogo,
                        height: 128,
                        width: 128,
                        opacity: 1,
                        excavate: true,
                    }} />
            </div>
            <div className={styles.documentId}>
                <span >{documentId}</span>
            </div>
        </>
    )
}