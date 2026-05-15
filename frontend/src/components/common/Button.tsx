import styles from './Button.module.css'


type ButtonProps = {
    onClick?: (() => void);
    label: string;
    visible?: boolean;
    className?: string;
}

export function Button(props: ButtonProps) {
    return (
        <button onClick={props.onClick} className={
            `${styles.button} ${props.className ?? ''}  ${props.visible ? styles.visible : ''}`
        }
            type="button">
            {props.label}
        </button>
    )
}
