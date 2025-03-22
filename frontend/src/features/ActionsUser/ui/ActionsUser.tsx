import { useUserStore } from "@/entities/User";
import { Button } from "@/shared/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";

export function ActionsUser({ userId }: { userId: number }) {
  const { deleteUser } = useUserStore();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Start Appointment</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: `/${userId}/edit` })}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => deleteUser(userId)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
