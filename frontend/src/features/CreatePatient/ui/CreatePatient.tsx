import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { postCreatePatient } from "../model/services";
import { useEffect, useState } from "react";
import { ModalField } from "./ModalField";
import { defaultPatient } from "../const";

enum Phase {
  Edit = "edit",
  AiRecord = "ai-record",
}

export function CreatePatient() {
  const [data, setData] = useState(defaultPatient);
  const [proposedChanges, setProposedChanges] =
    useState<Partial<typeof defaultPatient>>(defaultPatient);
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>(Phase.Edit);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["createPatient"],
    mutationFn: postCreatePatient,
  });

  function onSubmit() {
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["usersData"] });
        setIsOpen(false);
      },
    });
  }

  function onClose() {
    setIsOpen(false);
    setData(defaultPatient);
    setProposedChanges(defaultPatient);
  }

  useEffect(() => {
    if (!isOpen) {
      setProposedChanges(defaultPatient);
      setPhase(Phase.Edit);
    }
  }, [isOpen]);

  const handleChange = (key: any, value: string) => {
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

  const handleStartAi = () => setPhase(Phase.AiRecord);

  function mockGenerateDiff() {
    const mock: Partial<typeof defaultPatient> = {
      name: "Another",
      phone: new Date().getTime().toString(),
    };

    Object.keys(mock).forEach((k) => {
      const key = k as keyof typeof defaultPatient;
      if (data[key] === "") {
        setData((prev) => ({ ...prev, [key]: mock[key] }));
      } else {
        setProposedChanges((prev) => ({ ...prev, [key]: mock[key] }));
      }
    });
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="cursor-pointer">
        <PlusIcon />
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(v) => (v ? setIsOpen(true) : onClose())}
        modal
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Create Patient
            </DialogTitle>
          </DialogHeader>

          <Button onClick={mockGenerateDiff} className="cursor-pointer">
            Generate diff
          </Button>

          {phase === Phase.Edit ? (
            <>
              <div className="space-y-4">
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
                  value={data.other}
                  onChange={(e) => handleChange("other", e.target.value)}
                  proposedValue={proposedChanges.other}
                  onAccept={() => handleAccept("other")}
                  onDecline={() => handleDecline("other")}
                />
              </div>

              <Button onClick={handleStartAi} className="mt-6 w-full">
                🧑‍🧠 Start AI Voice Input
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <p className="text-sm text-muted-foreground">
                🎤 Listening... Speak now
              </p>
            </div>
          )}

          <Button onClick={onSubmit} className="mt-6 w-full">
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
