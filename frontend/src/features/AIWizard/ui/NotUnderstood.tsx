import { usePatientStore } from "@/entities/Patient";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Select, SelectValue } from "@radix-ui/react-select";
import { useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

type NotUnderstoodProps = {
  isOpen: boolean;
  onClose: () => void;
  CreatePatientModal: ({
    isOpen,
    onCloseModal,
  }: {
    isOpen: boolean;
    onCloseModal: () => void;
  }) => ReactNode;
};

export function NotUnderstood(props: NotUnderstoodProps) {
  const { isOpen, onClose, CreatePatientModal } = props;
  const navigate = useNavigate();

  const { patients } = usePatientStore();

  const [value, setValue] = useState<string | undefined>();
  const [isCreatePatientOpen, setIsCreatePatientOpen] = useState(false);

  function createHandler() {
    navigate({ to: `/patients/${value}/appointments/create` });
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>What to create</DialogTitle>
          </DialogHeader>
          <div className="flex justify-between items-center px-2.5">
            <Label>Create Patient</Label>
            <Button onClick={() => setIsCreatePatientOpen(true)}>
              Create Patient
            </Button>
          </div>
          <div className="flex justify-around items-center">
            <Label>Create appointment for: </Label>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Patients</SelectLabel>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={String(patient.id)}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={createHandler} disabled={!value}>
              Create appointment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <CreatePatientModal
        isOpen={isCreatePatientOpen}
        onCloseModal={() => {
          setIsCreatePatientOpen(false);
          onClose();
        }}
      />
    </>
  );
}
