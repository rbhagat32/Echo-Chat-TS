import styles from "./PageLoader.module.css";

export default function PageLoader() {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className={styles.loader}></div>
    </div>
  );
}
