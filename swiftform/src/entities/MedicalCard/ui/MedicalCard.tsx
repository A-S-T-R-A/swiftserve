import { useState } from "react";
import { Card } from "@/shared/ui/Card/Card";
import { EditableBlock } from "@/shared/ui/EditableBlock/EditableBlock";
import { EditableRow } from "@/shared/ui/EditableRow/EditableRow";
import styles from "./MedicalCard.module.scss";
import { Button } from "@/components/ui/button";
import {
  initialPatientState,
  initialState,
  medicalCardStructure,
} from "../сonst/const";
import { VoiceInputModal } from "@/widgets/VoiceInputModal/ui/VoiceInputModal";
import { PatientInputModal } from "@/widgets/PatientInputModal/ui/PatientInputModal";

export const MedicalCard = () => {
  const [data, setData] = useState(initialState);
  const [patientData, setPatientData] = useState(initialPatientState);
  const token = localStorage.getItem("token") || "";
  const [modalOpen, setModalOpen] = useState(false);
  const [patientModalOpen, setPatientModalOpen] = useState(false);

  return (
    <div className={styles.wrapper} id="pdfContainer">
      <div className={styles.buttonContainer}>
        <Button
          onClick={() => setModalOpen(true)}
          size="lg"
          style={{ height: "40px", width: "200px" }}
        >
          🎙️ Fill with Voice (Modal)
        </Button>
        <Button
          onClick={() => setPatientModalOpen(true)}
          size="lg"
          variant="outline"
        >
          🧠 AI Patient Form
        </Button>
      </div>
      <VoiceInputModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        data={data}
        setData={setData}
        token={token}
      />
      <PatientInputModal
        open={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        data={patientData}
        setData={setPatientData}
        token={token}
      />
      <Card>
        <div className={styles.container}>
          <div className={styles.leftColumn}>
            {medicalCardStructure.leftColumn.map(({ label, key }) => (
              <EditableRow
                key={key}
                label={label}
                defaultValue={data[key as keyof typeof data] || ""}
              />
            ))}
          </div>

          <div className={styles.rightColumn}>
            {medicalCardStructure.rightColumn.map((field) =>
              field.type === "block" ? (
                <EditableBlock
                  key={field.key}
                  title={field.title || ""}
                  placeholder={data[field.key as keyof typeof data] || ""}
                />
              ) : (
                <EditableRow
                  key={field.key}
                  label={field.label || ""}
                  defaultValue={data[field.key as keyof typeof data] || ""}
                />
              )
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
