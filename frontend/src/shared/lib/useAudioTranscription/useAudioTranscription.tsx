import { useRef, useState } from "react";
import { postGptRequest } from "./postGptRequest";

const getMedicalRecordTranscript = (transcript: string) => [
  {
    role: "system",
    content: `You are a medical assistant. Based on the patient's text, update only the mentioned fields in the medical record.
       Fix text and return the answer strictly in JSON format without comments, and only include fields that were mentioned in the text.
       Mostly i can talk "wait", but mean "weight", so somethimes change words in the text. 
       
       ⚠️ Instructions:
       - Fix grammar and typos.
       - Only include fields that were actually mentioned.
       - Return a **pure JSON** object (no markdown, no explanations, no code block).
       - Only include fields that are relevant to the patient form — ignore anything else.
       - Do NOT include fields with empty or unknown values.
       {
        "reason": "",
        "diagnosis": "",
        "prescription": "",
        "bp": 0,
        "heartRate": 0,
        "weight": 0,
        "height": 0,
        "notes": "",
  };`,
  },
  {
    role: "user",
    content: `Patient text:\n"${transcript}"`,
  },
];

const getPatientTranscript = (transcript: string) => [
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

const getAllTranscript = (transcript: string) => [
  {
    role: "system",
    content: `
Try to understand what the patient said.
And extract only the mentioned fields relevant to the following patient form:
Decide if the patient is talking about registration (patient form) or appointment (medical form). 
You must choose only one form. If the patient mentions the word 'appointment', 'prescription', 'blood pressure', or similar — it's medical. 
Otherwise — it's patient.
{  
"name": "",
  "surname": "",
  "phone": "",
  "other": ""
}

or about ( IF USER SPEAK ABOUT APPOINTMENT )

{
  "reason": "",
  "diagnosis": "",
  "prescription": "",
  "bp": '',
  "heartRate":'',
  "weight":'',
  "height":'',
  "notes": ""
}

fill only one form and return a **pure JSON** object (no markdown, no explanations, no code block).
if you fill form and you have unexpected information, in case of first form ( patient ) put this into other.
`,
  },
  {
    role: "user",
    content: `Patient said:\n"${transcript}"`,
  },
];

type TPrompt = {
  role: string;
  content: string;
};

export const useAudioTranscription = (
  token: string,
  onParsed: (parsed: any) => void,
  onComplete: () => void,
  type: "patient" | "record" | "all"
) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = (): Promise<void> =>
    new Promise((resolve, reject) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) return reject("No recorder");

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

          const formData = new FormData();
          formData.append("file", audioBlob, "audio.webm");
          formData.append("model", "gpt-4o-mini-transcribe");
          formData.append("response_format", "text");

          const response = await fetch(
            "https://api.openai.com/v1/audio/transcriptions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${
                  token || import.meta.env.VITE_OPENAI_API_KEY
                }`,
              },
              body: formData,
            }
          );

          const transcript = await response.text();
          console.log("[Transcribe] Raw transcript:", transcript);

          let prompt: TPrompt[] = [];

          if (type === "patient") {
            prompt = getPatientTranscript(transcript);
          } else if (type === "record") {
            prompt = getMedicalRecordTranscript(transcript);
          } else {
            prompt = getAllTranscript(transcript);
          }

          const gptResponse = await postGptRequest(prompt, token);

          const parsed = JSON.parse(gptResponse);
          console.log("[GPT] Parsed result:", parsed);
          onParsed(parsed);
        } catch (err) {
          console.error("[Speech] Error:", err);
        } finally {
          setRecording(false);
          onComplete();
          resolve();
        }
      };

      mediaRecorder.stop();
    });

  return {
    startRecording,
    stopRecording,
    recording,
  };
};
