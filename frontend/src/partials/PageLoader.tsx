import styles from "./Loader.module.css";

const PageLoader = () => {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className={styles.loader}></div>
    </div>
  );
};

export default PageLoader;
