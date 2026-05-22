import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Button } from './Button';
import styles from './NotFound.module.css';

export function NotFound() {
    const navigate = useNavigate();
    return (
        <Card className={styles.card}>
            <p className={styles.message}>It's okay to be lost sometimes...</p>
            <Button label='Go Home' onClick={() => navigate('/')} />
        </Card>
    );
}
