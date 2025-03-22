import styles from "./EditableRow.module.scss";

interface Props {
  label: string;
  defaultValue: string;
}

export const EditableRow = ({ label, defaultValue }: Props) => {
  return (
    <p className={styles.row}>
      {label}: <span contentEditable>{defaultValue}</span>
    </p>
  );
};
