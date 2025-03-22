import { useUserStore } from "@/entities/User";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { postUpdatePatient } from "../model/services";

type TEditPatientProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
};
export function EditPatient(props: TEditPatientProps) {
  const { isOpen, onClose, userId } = props;
  const queryClient = useQueryClient();
  const { getSelectedUser } = useUserStore();

  const patientData = getSelectedUser(userId);

  const { mutate } = useMutation({
    mutationKey: ["editPatient"],
    mutationFn: postUpdatePatient,
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    mutate(
      {
        name: formData.get("name") as string,
        surname: formData.get("surname") as string,
        phone: formData.get("phone") as string,
        other: formData.get("other-info") as string,
        patientId: userId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["usersData"] });
        },
      }
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
        </DialogHeader>
        <form
          id="create-patient-form"
          onSubmit={onSubmit}
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={patientData?.name ?? ""}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="surname" className="text-right">
              Surname
            </Label>
            <Input
              id="surname"
              value={patientData?.surname}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              value={patientData?.phone}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="other-info" className="text-right">
              Other info
            </Label>
            <Textarea
              id="other-info"
              value={patientData?.other}
              className="col-span-3"
            />
          </div>
        </form>
        <DialogFooter>
          <Button
            className="w-fit mr-auto cursor-pointer"
            variant="cosmicOutline"
          >
            AI
          </Button>
          <Button
            className="cursor-pointer"
            type="submit"
            form="create-patient-form"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
