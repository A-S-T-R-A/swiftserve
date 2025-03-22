import { Button } from "@/shared/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { EditPatient } from "@/features/EditPatient";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePatient } from "@/features/DeletePatient";

export function PatientsActions({ userId }: { userId: number }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  const { mutate } = useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: deletePatient,
  });

  function deleteHandler() {
    mutate(
      { patientId: userId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["usersData"] });
        },
      }
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              navigate({ to: `/patient/${userId}/appintments/create` })
            }
            className="cursor-pointer"
          >
            Start Appointment
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={deleteHandler}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditPatient
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userId={userId}
      />
    </>
  );
}
