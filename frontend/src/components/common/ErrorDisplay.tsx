import { AppError } from "../../types";
import styles from './ErrorDisplay.module.css'
type ErrorDisplayProps = {
    error: AppError
}


export function ErrorDisplay(props: ErrorDisplayProps) {

    return (
        <output className={styles.container} role="alert">
            <span className={styles.code}>{props.error.code}</span>
            <span className={styles.message}>{props.error.message}</span>
        </output>
    );
}