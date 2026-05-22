import sigilMark from '../../assets/sigil_mark_light.svg';
import styles from './SigilIndicator.module.css';

type SigilIndicatorProps = {
    label: string;
    alt: string;
};

export function SigilIndicator(props: SigilIndicatorProps) {
    return (
        <div className={styles.container}>
            <img className={styles.logo} src={sigilMark} alt={props.alt} />
            <p className={styles.p}>{props.label}</p>
        </div>
    );
}
