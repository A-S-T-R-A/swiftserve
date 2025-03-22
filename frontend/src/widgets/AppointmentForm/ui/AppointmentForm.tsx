import { useUserStore } from "@/entities/User";
import { postCreateAppointment } from "@/features/CreateAppointment/model/services";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import type { FormEvent } from "react";

export function AppointmentForm() {
  const { id } = useParams({ from: "/patients/$id/appointments/create" });
  const { getSelectedUser } = useUserStore();

  const patient = getSelectedUser(Number(id));

  const { mutate } = useMutation({
    mutationKey: ["createAppointment"],
    mutationFn: postCreateAppointment,
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    mutate({
      patientId: Number(id),
      reason: formData.get("reason") as string,
      diagnosis: formData.get("diagnosis") as string,
      prescription: formData.get("prescription") as string,
      bp: Number(formData.get("bp")),
      heartRate: Number(formData.get("heartRate")),
      weight: Number(formData.get("weight")),
      height: Number(formData.get("height")),
      notes: formData.get("notes") as string,
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          {patient?.name} create an appointment
        </h2>
        <Button variant="cosmicOutline" className="cursor-pointer w-fit">
          AI
        </Button>
      </div>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="reason" className="text-right">
            Reason
          </Label>
          <Input id="reason" name="reason" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="diagnosis" className="text-right">
            Diagnosis
          </Label>
          <Input id="diagnosis" name="diagnosis" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="prescription" className="text-right">
            Prescription
          </Label>
          <Input id="prescription" name="prescription" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="bp" className="text-right">
            Blood Pressure
          </Label>
          <Input id="bp" name="bp" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="heartrate" className="text-right">
            Heartrate
          </Label>
          <Input id="heartrate" name="heartrate" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="weight" className="text-right">
            Weight
          </Label>
          <Input id="weight" name="weight" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="height" className="text-right">
            Height
          </Label>
          <Input id="height" name="height" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="notes" className="text-right">
            Notes
          </Label>
          <Textarea id="notes" name="notes" className="col-span-3" />
        </div>
      </div>
      <div className="ml-auto flex gap-3">
        <Button type="submit">Save</Button>
        <Button type="button">Print Summary</Button>
      </div>
    </form>
  );
}
