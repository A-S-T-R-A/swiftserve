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
import { usePatientStore } from "@/entities/Patient";
import { useQuery } from "@tanstack/react-query";
import { getAppointmentById } from "@/entities/Appointment";
import { AppointmentEditForm } from "@/widgets/AppointmentEditForm";

export const Route = createFileRoute(
  "/patients/$id/appointments/$appointmentId/edit/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { id, appointmentId } = Route.useParams();
  const { getSelectedPatient } = usePatientStore();
  const navigate = useNavigate();
  const patient = getSelectedPatient(Number(id));

  const { data, isPending, error } = useQuery({
    queryKey: ["getAppointmentById", appointmentId],
    queryFn: () => getAppointmentById(Number(appointmentId)),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <AppHeader />
      <Main>
        <Breadcrumb className="mb-10">
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
                {getSelectedPatient(Number(id))?.name}{" "}
                {getSelectedPatient(Number(id))?.surname}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Appointment</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <AppointmentEditForm appointmentData={data} />
      </Main>
    </div>
  );
}
