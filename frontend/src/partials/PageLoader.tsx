import styles from "./PageLoader.module.css";

const PageLoader = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  return (
    <div
      className={`z-50 ${
        fullScreen ? "fixed h-screen w-screen" : "h-full w-full"
      } grid place-items-center`}
    >
      <div className={styles.loader}></div>
    </div>
  );
};

export default PageLoader;
