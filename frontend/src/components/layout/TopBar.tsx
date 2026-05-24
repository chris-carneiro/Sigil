import sigilMark from '../../assets/sigil_mark_light.svg';
import styles from './TopBar.module.css';

function TopBar () {
    return (
        <header className={styles.topBar}>
            <img
                className={styles.logo}
                src={sigilMark}
                alt='Sigil mark light encrypting veil logo'
            />
            <span>Sigil</span>
        </header>
    );
}

export default TopBar;
