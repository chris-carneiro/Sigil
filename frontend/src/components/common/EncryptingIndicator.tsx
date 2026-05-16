import sigilMark from '../../assets/sigil_mark_light.svg';
import styles from './EncryptingIndicator.module.css';


export function EncryptingIndicator() {
    return (
        <div className={styles.container}>
            <img className={styles.logo} src={sigilMark} alt="Encrypting before uploading." />
            <p className={styles.p}>Encrypting...</p>
        </div>
    )
}