import styles from './Card.module.css';

type CardProps = {
    children: React.ReactNode;
    variant?: 'default' | 'danger';
    className?: string;
};

export function Card({ children, variant, className }: CardProps) {
    return (
        <div className={`${styles.card} ${variant === 'danger' ? styles.danger : ''} ${className ?? ''}`}>
            {children}
        </div>
    );
}
