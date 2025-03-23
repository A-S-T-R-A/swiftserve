import { usePatientStore } from "@/entities/Patient";
import { postCreateAppointment } from "@/features/CreateAppointment/model/services";
import { postCreatePatient } from "@/features/CreatePatient/model/services";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { MicIcon } from "lucide-react";
import { useState } from "react";
import { AppointmentModal } from "./AppointmentModal";

export function AiWizardButton() {
  const navigate = useNavigate();
  const { patients } = usePatientStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isAppoinmentOpen, setIsAppointmentOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: createPatient } = useMutation({
    mutationKey: ["createPatient"],
    mutationFn: postCreatePatient,
  });
  const { mutate: createAppointment } = useMutation({
    mutationKey: ["createAppointment"],
    mutationFn: postCreateAppointment,
  });

  function onCreatePatient() {
    createPatient(
      {
        name: "AI",
        surname: "Wizard",
        phone: new Date().getTime().toString(),
        other: "Cool",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["usersData"] });
          navigate({ to: "/" });
          setIsOpen(false);
        },
      }
    );
  }

  function onStartAppointment() {
    const patient = patients[0];

    createAppointment(
      {
        patientId: Number(patient.id),
        reason: "Ai wizard",
        diagnosis: "ai fever",
        prescription: "prescription",
        bp: 21,
        heartRate: 11,
        weight: 22,
        height: 22,
        notes: "321",
      },
      {
        onSuccess: (data) => {
          navigate({
            to: `/patients/${patient.id}/appointments/${data.id}/`,
          });
        },
      }
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Button
          onClick={() => setIsOpen(true)}
          onMouseDown={() => setIsListening(true)}
          onMouseUp={() => setIsListening(false)}
          variant="cosmicOutline"
          className="cursor-pointer"
          size="sm"
        >
          {isListening ? (
            <>
              <MicIcon /> Listening...
            </>
          ) : (
            "AI Wizard"
          )}
        </Button>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose flow</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={onCreatePatient}>Create patient OK</Button>
            <Button onClick={onStartAppointment}>
              Start Appointment for Patient OK
            </Button>
            <Button onClick={() => setIsAppointmentOpen(true)}>
              Start Appointment for Patient NOT UNDERSTOOD
            </Button>
            <Button>NOT UNDERSTOOD</Button>
          </div>
        </DialogContent>
      </Dialog>
      <AppointmentModal
        isOpen={isAppoinmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />
    </>
  );
}
