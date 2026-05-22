declare module '*.module.css' {
    const styles: { [key: string]: string };
    export default styles;
}

declare module '*.svg' {
    const src: string;
    export default src;
}
