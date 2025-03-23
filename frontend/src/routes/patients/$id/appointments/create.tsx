import { Main } from "@/shared/ui/main";
import { AppHeader } from "@/widgets/AppHeader";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { useUserStore } from "@/entities/Patient";
import { AppointmentForm } from "@/widgets/AppointmentForm";

export const Route = createFileRoute("/patients/$id/appointments/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { getSelectedUser } = useUserStore();

  return (
    <div>
      <AppHeader />
      <Main>
        <Breadcrumb className="mb-20">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate({ to: "/" })}>
                Patients
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate({ to: `/patients/${id}/appointments` })}
              >
                {getSelectedUser(Number(id))?.name}{" "}
                {getSelectedUser(Number(id))?.surname}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Create an appointment</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <AppointmentForm />
      </Main>
    </div>
  );
}
