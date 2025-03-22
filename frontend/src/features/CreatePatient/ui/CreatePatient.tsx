import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { postCreatePatient } from "../model/services";
import type { FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";

export function CreatePatient() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["createPatient"],
    mutationFn: postCreatePatient,
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
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["usersData"] });
          navigate({ to: "/" });
        },
      }
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Patient</DialogTitle>
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
              value="Pedro Duarte"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="surname" className="text-right">
              Surname
            </Label>
            <Input id="surname" value="@peduarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input id="phone" value="@peduarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="other-info" className="text-right">
              Other info
            </Label>
            <Textarea
              id="other-info"
              value="@peduarte"
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
