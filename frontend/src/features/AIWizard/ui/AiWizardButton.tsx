import { usePatientStore } from "@/entities/Patient";
import { postCreatePatient } from "@/features/CreatePatient/model/services";
import { Button } from "@/shared/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { MicIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AppointmentModal } from "./AppointmentModal";
import { useAudioTranscription } from "@/shared/lib/useAudioTranscription/useAudioTranscription";
import { NotUnderstood } from "./NotUnderstood";

export function AiWizardButton({
  CreatePatientModal,
}: {
  CreatePatientModal: ({
    isOpen,
    onCloseModal,
  }: {
    isOpen: boolean;
    onCloseModal: () => void;
  }) => ReactNode;
}) {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const { patients } = usePatientStore();
  const [isAppoinmentOpen, setIsAppointmentOpen] = useState(false);
  const [isNotUnderstoodOpen, setIsNotUnderstoodOpen] = useState(false);
  const [initialAppointmentData, setInitialAppointmentData] = useState();
  const queryClient = useQueryClient();

  const { mutate: createPatient } = useMutation({
    mutationKey: ["createPatient"],
    mutationFn: postCreatePatient,
  });

  const { startRecording, stopRecording } = useAudioTranscription(
    import.meta.env.VITE_OPENAI_API_KEY,
    (parsed) => {
      console.log("[AI Wizard Parsed]", parsed);
      if (!initialAppointmentData) {
        setInitialAppointmentData(parsed);
      }

      const hasPatientData =
        parsed.name ||
        (parsed.name && (parsed.surname || parsed.phone || parsed.other));
      const hasAppointmentData =
        parsed.reason ||
        parsed.diagnosis ||
        parsed.bp ||
        parsed.heartRate ||
        parsed.weight ||
        parsed.height ||
        parsed.notes;

      if (hasPatientData && !hasAppointmentData) {
        createPatient(
          {
            name: parsed.name || "",
            surname: parsed.surname || "",
            phone: parsed.phone || "",
            other: parsed.other || "",
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["usersData"] });
              navigate({ to: "/" });
            },
          }
        );
      } else if (hasAppointmentData) {
        const patient = patients[0];

        navigate({
          to: `/patients/${patient.id}/appointments/create`,
          state: {
            data: parsed,
          },
        } as any);
      } else {
        setIsNotUnderstoodOpen(true);
      }
    },
    () => setIsListening(false),
    "all"
  );

  return (
    <>
      <Button
        onMouseDown={() => {
          setIsListening(true);
          startRecording();
        }}
        onMouseUp={stopRecording}
        onMouseLeave={stopRecording}
        variant="cosmicOutline"
        className="cursor-pointer"
        size="sm"
      >
        {isListening ? (
          <>
            <MicIcon className="mr-2 animate-pulse" />
            Listening...
          </>
        ) : (
          "AI Wizard"
        )}
      </Button>
      <AppointmentModal
        isOpen={isAppoinmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        initialData={initialAppointmentData as any}
      />
      <NotUnderstood
        isOpen={isNotUnderstoodOpen}
        onClose={() => setIsNotUnderstoodOpen(false)}
        CreatePatientModal={CreatePatientModal}
      />
    </>
  );
}
