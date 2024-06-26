import styles from "./index.module.less";

export default function Item({
  label,
  children,
  tips,
}: {
  label?: string;
  children: JSX.Element | any;
  tips?: string;
}) {
  return (
    <div className={styles.main}>
      {label && <label>{label}</label>}
      {children}
      <p className={styles.tips}>{tips}</p>
    </div>
  );
}
