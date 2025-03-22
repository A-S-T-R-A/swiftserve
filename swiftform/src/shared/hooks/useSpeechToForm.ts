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
  dataType: "patient" | "medicalRecord",
  onComplete?: () => void
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

    recognition.onstart = () => {
      console.log("[Speech] Recognition started");
    };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const results: SpeechRecognitionResult = event.results;
      console.log("[Speech] Got result event:", results);

      for (let i = event.resultIndex; i < results.length; ++i) {
        const result = results[i];
        if (result.isFinal) {
          const text = result[0].transcript;
          console.log("[Speech] Final transcript segment:", text);
          transcriptRef.current += text;
        }
      }

      const finalTranscript = transcriptRef.current.trim();
      if (finalTranscript) {
        console.log("[Speech] Full final transcript:", finalTranscript);

        transcriptRef.current = "";

        const currentTranscript =
          dataType === "patient"
            ? getPatientTranscript(finalTranscript)
            : getMedicalRecordTranscript(finalTranscript);

        console.log("[GPT] Prompt:", currentTranscript);

        try {
          const response = await postGptRequest(currentTranscript, token);
          console.log("[GPT] Raw response:", response);

          const parsed: Partial<T> = JSON.parse(response);
          console.log("[GPT] Parsed response:", parsed);

          onResult(parsed);
        } catch (err) {
          console.error("[GPT] Error parsing GPT response:", err);
        } finally {
          onComplete?.(); // <-- вызываем после завершения
        }
      }
    };

    recognition.onend = () => {
      console.log("[Speech] Recognition ended");
      if (shouldListenRef.current) {
        console.log("[Speech] Restarting due to shouldListenRef");
        recognition.start();
      } else {
        console.log("[Speech] Stopped listening");
        setListening(false);
      }
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      console.error("[Speech] Recognition error:", e.error);
      if (e.error === "no-speech" && shouldListenRef.current) {
        console.log("[Speech] Restarting after no-speech error");
        recognition.start();
      } else {
        console.log("[Speech] Not restarting, disabling listening");
        setListening(false);
      }
    };

    return () => {
      console.log("[Speech] Cleaning up recognition");
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [token, onResult]);

  const startListening = () => {
    if (!listening && recognitionRef.current) {
      console.log("[Speech] Starting listening");
      shouldListenRef.current = true;
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      console.log("[Speech] Stopping listening");
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
