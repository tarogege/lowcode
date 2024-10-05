import { Style } from "../../store/editStoreTypes";
import styles from "./index.module.less";

interface IItemProps {
  label: string;
  children: JSX.Element;
  tips?: string;
  labelStyle?: Style;
}

const Item = ({ label, children, tips, labelStyle }: IItemProps) => {
  return (
    <div className={styles.main}>
      <label style={labelStyle}>{label}</label>
      {children}
      <p className={styles.tips}>{tips}</p>
    </div>
  );
};

export default Item;
