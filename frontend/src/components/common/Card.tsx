import styles from './Card.module.css'

type CardProps = {
    children: React.ReactNode
    variant?: 'default' | 'danger'
}

export function Card(props: CardProps) {
    return (
        <div className={`${styles.card} ${props.variant === 'danger' ? styles.danger : ''}`}>
            {props.children}
        </div>
    )
}