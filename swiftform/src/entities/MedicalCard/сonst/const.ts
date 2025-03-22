export const initialState = {
  reason: "",
  diagnosis: "",
  prescription: "",
  bp: 0,
  heartRate: 0,
  weight: 0,
  height: 0,
  notes: "",
};

export const initialPatientState = {
  name: "",
  surname: "",
  phone: "",
  other: "",
};

export const medicalCardStructure = {
  leftColumn: [
    { label: "Name", key: "name", type: "row" },
    { label: "Surname", key: "surname", type: "row" },
    { label: "Phone", key: "phone", type: "row" },
    { label: "Other", key: "other", type: "block" },
  ],
  rightColumn: [
    { label: "Reason", key: "reason", type: "block" },
    { label: "Diagnosis", key: "diagnosis", type: "block" },
    { label: "Prescription", key: "prescription", type: "block" },
    { label: "Notes", key: "notes", type: "block" },
    { label: "Blood Pressure", key: "bp", type: "row" },
    { label: "Heart Rate", key: "heartRate", type: "row" },
    { label: "Weight", key: "weight", type: "row" },
    { label: "Height", key: "height", type: "row" },
  ],
};
