import styles from './Button.module.css'


type ButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'className'> & {
    label: string;
    className?: string;
}

export function Button({ label, className, ...rest }: ButtonProps) {
    return (
        <button {...rest} className={
            `${styles.button} ${className ?? ''}`
        }
            type="button">
            {label}
        </button>
    )
}
