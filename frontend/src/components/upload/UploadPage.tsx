import styles from './UploadPage.module.css';

type UploadPageProps = {
    children: React.ReactNode
}

function UploadPage({ children }: UploadPageProps) {
    return (
        <div className={styles.card}>
            {children}
        </div>
    )
}

export default UploadPage;