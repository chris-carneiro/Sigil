import styles from './Main.module.css';

type Content = {
    children: React.ReactNode;
};

function Main ({ children }: Content) {
    return <main className={styles.main}>{children}</main>;
}

export default Main;
