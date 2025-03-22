import styles from "./EditableBlock.module.scss";

interface Props {
  title: string;
  value?: string;
}

export const EditableBlock = ({ title, value }: Props) => {
  return (
    <div className={styles.block}>
      <p className={styles.title}>{title}</p>
      <p contentEditable>{value}</p>
    </div>
  );
};
