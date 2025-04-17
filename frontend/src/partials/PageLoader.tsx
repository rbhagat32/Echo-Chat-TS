import styles from "./PageLoader.module.css";

const PageLoader = () => {
  return (
    <div className="fixed z-50 w-screen h-screen grid place-items-center">
      <div className={styles.loader}></div>
    </div>
  );
};

export default PageLoader;
