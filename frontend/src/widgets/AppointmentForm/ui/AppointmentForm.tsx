import { usePatientStore } from "@/entities/Patient";
import { Button } from "@/shared/ui/button";
import { useMutation } from "@tanstack/react-query";
import {
  useNavigate,
  useParams,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader } from "lucide-react";
import { useAudioTranscription } from "@/shared/lib/useAudioTranscription/useAudioTranscription";
import { ModalField } from "@/features/CreatePatient/ui/ModalField";
import { postCreateAppointment } from "../model/services/services";
import { defaultAppointment } from "../const";

export function AppointmentForm() {
  const { id } = useParams({
    from: "/patients/$id/appointments/create",
  });
  const navigate = useNavigate();
  const { getSelectedPatient } = usePatientStore();
  const patient = getSelectedPatient(Number(id));

  const router = useRouter();

  const state = router.state.location.state;
  const initialData =
    state && "data" in state ? (state as any).data : undefined;

  const [data, setData] = useState(initialData || defaultAppointment);
  const [proposedChanges, setProposedChanges] = useState<
    Partial<typeof defaultAppointment>
  >({});
  const [recording, setRecording] = useState(false);

  const { startRecording, stopRecording } = useAudioTranscription(
    import.meta.env.VITE_OPENAI_API_KEY,
    (parsed) => {
      const autoAccepted: Partial<typeof defaultAppointment> = {};
      const proposed: Partial<typeof defaultAppointment> = {};

      for (const key in parsed) {
        const typedKey = key as keyof typeof defaultAppointment;
        if (!data[typedKey]) {
          autoAccepted[typedKey] = parsed[typedKey];
        } else {
          proposed[typedKey] = parsed[typedKey];
        }
      }

      setData((prev: typeof defaultAppointment) => ({
        ...prev,
        ...autoAccepted,
      }));
      setProposedChanges((prev) => ({ ...prev, ...proposed }));
    },
    () => setRecording(false),
    "record"
  );

  const { mutate } = useMutation({
    mutationKey: ["createAppointment"],
    mutationFn: postCreateAppointment,
  });

  const handleChange = (key: keyof typeof data, value: string) => {
    setData((prev: typeof defaultAppointment) => ({ ...prev, [key]: value }));
  };

  const handleAccept = (key: keyof typeof data) => {
    setData((prev: typeof defaultAppointment) => ({
      ...prev,
      [key]:
        (proposedChanges as Record<keyof typeof defaultAppointment, string>)[
          key as keyof typeof proposedChanges
        ] || "",
    }));
    setProposedChanges((prev) => ({
      ...prev,
      [key]: "",
    }));
  };
  const handleDecline = (key: keyof typeof data) => {
    setProposedChanges((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        patientId: Number(id),
        reason: data.reason,
        diagnosis: data.diagnosis,
        prescription: data.prescription,
        bp: Number(data.bp),
        heartRate: Number(data.heartRate),
        weight: Number(data.weight),
        height: Number(data.height),
        notes: data.notes,
      },
      {
        onSuccess: (data) => {
          navigate({
            to: `/patients/${id}/appointments/${data.id}/`,
          });
        },
      }
    );
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          {patient?.name} create an appointment
        </h2>
        <Button
          type="button"
          onMouseDown={() => {
            setRecording(true);
            startRecording();
          }}
          onMouseUp={() => {
            stopRecording();
          }}
          onMouseLeave={() => {
            stopRecording();
          }}
          variant={recording ? "secondary" : "cosmicOutline"}
          className="cursor-pointer w-fit"
        >
          {recording ? <Loader className="animate-spin" /> : "AI"}
        </Button>
      </div>

      <div className="grid gap-4 py-4">
        <ModalField
          label="Reason"
          value={data.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          proposedValue={proposedChanges.reason}
          onAccept={() => handleAccept("reason")}
          onDecline={() => handleDecline("reason")}
        />
        <ModalField
          label="Diagnosis"
          value={data.diagnosis}
          onChange={(e) => handleChange("diagnosis", e.target.value)}
          proposedValue={proposedChanges.diagnosis}
          onAccept={() => handleAccept("diagnosis")}
          onDecline={() => handleDecline("diagnosis")}
        />
        <ModalField
          label="Prescription"
          value={data.prescription}
          onChange={(e) => handleChange("prescription", e.target.value)}
          proposedValue={proposedChanges.prescription}
          onAccept={() => handleAccept("prescription")}
          onDecline={() => handleDecline("prescription")}
        />
        <ModalField
          label="Blood Pressure"
          value={data.bp}
          onChange={(e) => handleChange("bp", e.target.value)}
          proposedValue={proposedChanges.bp}
          onAccept={() => handleAccept("bp")}
          onDecline={() => handleDecline("bp")}
        />
        <ModalField
          label="Heart Rate"
          value={data.heartRate}
          onChange={(e) => handleChange("heartRate", e.target.value)}
          proposedValue={proposedChanges.heartRate}
          onAccept={() => handleAccept("heartRate")}
          onDecline={() => handleDecline("heartRate")}
        />
        <ModalField
          label="Weight"
          value={data.weight}
          onChange={(e) => handleChange("weight", e.target.value)}
          proposedValue={proposedChanges.weight}
          onAccept={() => handleAccept("weight")}
          onDecline={() => handleDecline("weight")}
        />
        <ModalField
          label="Height"
          value={data.height}
          onChange={(e) => handleChange("height", e.target.value)}
          proposedValue={proposedChanges.height}
          onAccept={() => handleAccept("height")}
          onDecline={() => handleDecline("height")}
        />
        <ModalField
          label="Notes"
          variant="textarea"
          value={data.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          proposedValue={proposedChanges.notes}
          onAccept={() => handleAccept("notes")}
          onDecline={() => handleDecline("notes")}
        />
      </div>
      <div className="ml-auto flex gap-3">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
