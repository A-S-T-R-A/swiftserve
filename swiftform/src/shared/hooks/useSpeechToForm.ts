import { postGptRequest } from "@/entities/MedicalCard/model/services/postGptRequest";
import { useEffect, useRef, useState } from "react";
import {
  getMedicalRecordTranscript,
  getPatientTranscript,
} from "../lib/gpt/getUserTranscript";

type SpeechRecognitionResult = SpeechRecognitionEvent["results"];

export const useSpeechToForm = <T>(
  token: string,
  onResult: (parsed: Partial<T>) => void,
  dataType: "patient" | "medicalRecord"
) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [listening, setListening] = useState(false);
  const shouldListenRef = useRef(false);
  const transcriptRef = useRef("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const results: SpeechRecognitionResult = event.results;

      for (let i = event.resultIndex; i < results.length; ++i) {
        const result = results[i];
        if (result.isFinal) {
          transcriptRef.current += result[0].transcript;
        }
      }

      if (transcriptRef.current.trim()) {
        const currentTranscript =
          dataType === "patient"
            ? getPatientTranscript(transcriptRef.current)
            : getMedicalRecordTranscript(transcriptRef.current);

        try {
          const response = await postGptRequest(currentTranscript, token);
          const parsed: Partial<T> = JSON.parse(response);
          onResult(parsed);
        } catch (err) {
          console.error("Error processing GPT response:", err);
        } finally {
          transcriptRef.current = "";
        }
      }
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        recognition.start();
      } else {
        setListening(false);
      }
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", e.error);
      if (e.error === "no-speech" && shouldListenRef.current) {
        recognition.start();
      } else {
        setListening(false);
      }
    };
  }, [token, onResult]);

  const startListening = () => {
    if (!listening && recognitionRef.current) {
      shouldListenRef.current = true;
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      shouldListenRef.current = false;
      recognitionRef.current.stop();
    }
  };

  return {
    startListening,
    stopListening,
    listening,
  };
};
