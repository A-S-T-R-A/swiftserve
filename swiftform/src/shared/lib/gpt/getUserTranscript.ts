export const getMedicalRecordTranscript = (transcript: string) => [
  {
    role: "system",
    content: `You are a medical assistant. Based on the patient's text, update only the mentioned fields in the medical record.
     Fix text and return the answer strictly in JSON format without comments, and only include fields that were mentioned in the text.
     
     {
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
};`,
  },
  {
    role: "user",
    content: `Patient text:\n"${transcript}"`,
  },
];

export const getPatientTranscript = (transcript: string) => [
  {
    role: "system",
    content: `You are a medical assistant. Based on the patient's speech, extract only the mentioned fields relevant to the following patient form:

{
  name: "",
  surname: "",
  phone: "",
  other: ""
}

⚠️ Instructions:
- Fix grammar and typos.
- Only include fields that were actually mentioned.
- Return a **pure JSON** object (no markdown, no explanations, no code block).
- Only include fields that are relevant to the patient form — ignore anything else.
- Do NOT include fields with empty or unknown values.
`,
  },
  {
    role: "user",
    content: `Patient speech:\n"${transcript}"`,
  },
];
