import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { postCreatePatient } from "../model/services";
import { useEffect, useState } from "react";
import { ModalField } from "./ModalField";
import { defaultPatient } from "../const";
import { useAudioTranscription } from "@/shared/lib/useAudioTranscription/useAudioTranscription";
import { useNavigate } from "@tanstack/react-router";
import type { TPatient } from "@/entities/Patient";

export function CreatePatientModal({
  isOpen,
  onCloseModal,
  patientData,
}: {
  isOpen: boolean;
  onCloseModal: () => void;
  patientData?: TPatient;
}) {
  const navigate = useNavigate();
  const [data, setData] = useState(patientData || defaultPatient);
  const [proposedChanges, setProposedChanges] =
    useState<Partial<typeof defaultPatient>>(defaultPatient);

  useEffect(() => {
    if (patientData) {
      setData(patientData);
    }
  }, [patientData]);

  const { startRecording, stopRecording, recording } = useAudioTranscription(
    import.meta.env.VITE_OPENAI_API_KEY,
    (parsed) => {
      const autoAccepted: Partial<typeof defaultPatient> = {};
      const proposed: Partial<typeof defaultPatient> = {};

      for (const key in parsed) {
        if (!data[key as keyof typeof data]) {
          autoAccepted[key as keyof typeof data] = parsed[key];
        } else {
          proposed[key as keyof typeof data] = parsed[key];
        }
      }

      setData((d) => ({ ...d, ...autoAccepted }));
      setProposedChanges(proposed);
    },
    () => null,
    "patient"
  );

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["createPatient"],
    mutationFn: postCreatePatient,
  });

  function onSubmit() {
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["usersData"] });
        onCloseModal();
        navigate({ to: "/" });
      },
    });
  }

  function onClose() {
    onCloseModal();
    setData(defaultPatient);
    setProposedChanges({});
  }

  const handleChange = (key: keyof typeof data, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAccept = (key: keyof typeof data) => {
    setData((prev) => ({
      ...prev,
      [key]: proposedChanges[key],
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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      // onOpenChange={(v) => (v ? setIsOpen(true) : onClose())}
      modal
    >
      <DialogContent className="max-w-lg">
        <DialogHeader className="flex-row items-center justify-between pr-10">
          <DialogTitle className="flex items-center justify-between">
            Create Patient
          </DialogTitle>
          <Button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            variant={recording ? "secondary" : "default"}
            className="cursor-pointer"
          >
            {recording ? <Loader className="animate-spin" /> : "AI"}
          </Button>
        </DialogHeader>
        <>
          <div className="space-y-4">
            <div className="flex gap-4 w-full">
              <ModalField
                label="Name"
                value={data.name}
                onChange={(e) => handleChange("name", e.target.value)}
                proposedValue={proposedChanges.name}
                onAccept={() => handleAccept("name")}
                onDecline={() => handleDecline("name")}
              />
              <ModalField
                label="Surname"
                value={data.surname}
                onChange={(e) => handleChange("surname", e.target.value)}
                proposedValue={proposedChanges.surname}
                onAccept={() => handleAccept("surname")}
                onDecline={() => handleDecline("surname")}
              />
            </div>
            <ModalField
              key="phone"
              label="Phone"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              proposedValue={proposedChanges.phone}
              onAccept={() => handleAccept("phone")}
              onDecline={() => handleDecline("phone")}
            />

            <ModalField
              key="other"
              label="Other Info"
              variant="textarea"
              value={data.other}
              onChange={(e) => handleChange("other", e.target.value)}
              proposedValue={proposedChanges.other}
              onAccept={() => handleAccept("other")}
              onDecline={() => handleDecline("other")}
            />
          </div>
        </>
        <Button onClick={onSubmit} className="w-full h-12 cursor-pointer">
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
