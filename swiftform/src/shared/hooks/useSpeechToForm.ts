import { useRef, useState } from "react";
import { postGptRequest } from "@/entities/MedicalCard/model/services/postGptRequest";
import {
  getMedicalRecordTranscript,
  getPatientTranscript,
} from "@/shared/lib/gpt/getUserTranscript";

export const useAudioTranscription = (
  token: string,
  onParsed: (parsed: any) => void,
  onComplete: () => void,
  type: "patient" | "record"
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

          const prompt =
            type === "patient"
              ? getPatientTranscript(transcript)
              : getMedicalRecordTranscript(transcript);
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
