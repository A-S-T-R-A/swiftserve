import { useUserStore } from "@/entities/Patient";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { Button } from "@/shared/ui/button";
import { Main } from "@/shared/ui/main";
import { AppHeader } from "@/widgets/AppHeader";
import { AppointmentsDashboardTable } from "@/widgets/AppointmentsDashboard";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/patients/$id/appointments/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { getSelectedUser } = useUserStore();
  const patient = getSelectedUser(Number(id));

  return (
    <div>
      <AppHeader />
      <Breadcrumb className="mb-10">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate({ to: "/" })}>
              Patients
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {patient?.name} {patient?.surname}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>

          <Button
            className="cursor-pointer"
            onClick={() =>
              navigate({ to: `/patients/${id}/appointments/create` })
            }
          >
            <PlusIcon />
          </Button>
        </div>

        <AppointmentsDashboardTable />
      </Main>
    </div>
  );
}
