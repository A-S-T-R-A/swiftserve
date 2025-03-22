import styles from "./EditableBlock.module.scss";

interface Props {
  title: string;
  placeholder?: string;
}

export const EditableBlock = ({ title, placeholder }: Props) => {
  return (
    <div className={styles.block}>
      <p className={styles.title}>{title}</p>
      <p contentEditable>{placeholder}</p>
    </div>
  );
};
