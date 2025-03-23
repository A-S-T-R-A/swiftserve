import { Button } from "@/shared/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAppointment } from "@/features/DeleteAppointment";

export function AppointmentActions({
  appointmentId,
}: {
  appointmentId: number | null;
}) {
  const { id: patientId } = useParams({ from: "/patients/$id/appointments/" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["deleteAppointment"],
    mutationFn: deleteAppointment,
  });

  function deleteHandler() {
    mutate(
      { appointmentId: Number(appointmentId) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getAppointments"] });
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
              navigate({
                to: `/patients/${patientId}/appointments/${appointmentId}/edit`,
              })
            }
            className="cursor-pointer"
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={deleteHandler}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
