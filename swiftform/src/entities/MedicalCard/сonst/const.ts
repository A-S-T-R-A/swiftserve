export const initialState = {
  name: "Patient Name",
  dob: "DD/MM/YYYY",
  phone: "+123456789",
  email: "email@example.com",
  address: "123 Street, City",
  history: "",
  symptoms: "",
  diagnosis: "",
  temperature: "",
  bloodPressure: "",
  heartRate: "",
  allergies: "",
  medications: "",
  insurancePolicy: "",
  doctorName: "",
  medicalRecordNumber: "",
  dateOfExamination: "",
  observations: "",
};

export const initialPatientState = {
  name: "",
  surname: "",
  phone: "",
  other: "",
};

export const medicalCardStructure = {
  leftColumn: [
    { label: "Patient Name", key: "name" },
    { label: "Date of Birth", key: "dob" },
    { label: "Phone", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Address", key: "address" },
  ],
  rightColumn: [
    { title: "Medical History", key: "history", type: "block" },
    { title: "Current Symptoms", key: "symptoms", type: "block" },
    { title: "Diagnosis", key: "diagnosis", type: "block" },
    { label: "Temperature", key: "temperature", type: "row" },
    { label: "Blood Pressure", key: "bloodPressure", type: "row" },
    { label: "Heart Rate", key: "heartRate", type: "row" },
    { label: "Allergies", key: "allergies", type: "row" },
    { label: "Medications", key: "medications", type: "row" },
    { label: "Insurance Policy", key: "insurancePolicy", type: "row" },
    { label: "Doctor Name", key: "doctorName", type: "row" },
    { label: "Medical Record Number", key: "medicalRecordNumber", type: "row" },
    { label: "Date of Examination", key: "dateOfExamination", type: "row" },
    { title: "Observations", key: "observations", type: "block" },
  ],
};
