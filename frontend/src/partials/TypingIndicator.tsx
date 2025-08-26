import styles from "./TypingIndicator.module.css";

export default function TypingIndicator() {
  return (
    <div className={styles.typingIndicatorContainer}>
      <div className={styles.typingIndicatorBubble}>
        {[...Array(3)].map((_, index) => (
          <div key={index} className={styles.typingIndicatorBubbleDot}></div>
        ))}
      </div>
    </div>
  );
}
