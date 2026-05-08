import styles from './UploadPage.module.css';

function UploadPage({ children }) {
    return (
        <div className={styles.card}>
            {children}
        </div>
    )
}

export default UploadPage;