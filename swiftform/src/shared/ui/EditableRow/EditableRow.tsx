import styles from "./EditableRow.module.scss";

interface Props {
  label: string;
  value: string;
}

export const EditableRow = ({ label, value }: Props) => {
  return (
    <p className={styles.row}>
      {label}: <span contentEditable>{value}</span>
    </p>
  );
};
