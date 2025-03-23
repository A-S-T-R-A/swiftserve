import type { TAppointment } from "@/entities/Appointment";
import { usePatientStore } from "@/entities/Patient";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

type TAppointmentModal = {
  isOpen: boolean;
  onClose: () => void;
  initialData: TAppointment;
};
export function AppointmentModal(props: TAppointmentModal) {
  const { isOpen, onClose, initialData } = props;

  const navigate = useNavigate();
  const { patients } = usePatientStore();

  const [value, setValue] = useState<string | undefined>();

  console.log("INITIAL STATE IN APPOINTMENT MODAL: ", initialData);

  function createHandler() {
    navigate({
      state: {
        data: initialData,
      },
    } as any);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create appointment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label>Create appointment for</Label>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder="Select a patient"
                // onChange={setValue}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Patients</SelectLabel>
                {patients.map((patient) => (
                  <SelectItem value={String(patient.id)}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={createHandler} disabled={!value}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
