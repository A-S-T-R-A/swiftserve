import { getAppointmentById } from "@/entities/Appointment";
import { usePatientStore } from "@/entities/Patient";
import { PrintSummaryButton } from "@/features/PrintSummary";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { Input } from "@/shared/ui/input";
import { Main } from "@/shared/ui/main";
import { AppHeader } from "@/widgets/AppHeader";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/patients/$id/appointments/$appointmentId/"
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

  const dateObj = data ? new Date(data.createdAt).toLocaleString() : "";

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
              <BreadcrumbPage>Appointment</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col">
          <h2 className="text-2xl  font-semibold tracking-tight">
            {patient?.name} -{" "}
            <span className="font-normal text-gray-500">
              Appointment on {dateObj}
            </span>
          </h2>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              Reason
              <Input id="reason" value={data.reason} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              Diagnosis
              <Input
                id="diagnosis"
                value={data.diagnosis || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              Prescription
              <Input
                id="prescription"
                value={data.prescription || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              Blood Preassure
              <Input id="bp" value={data.bp || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              Heartrate
              <Input
                id="heartrate"
                value={data.heartRate || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              Weight
              <Input id="weight" value={data.weight} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              Height
              <Input id="height" value={data.height} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              Notes
              <Input
                id="notes"
                value={data.notes || ""}
                className="col-span-3"
              />
            </div>
          </div>
          <PrintSummaryButton id={Number(appointmentId)} />
        </div>
      </Main>
    </div>
  );
}
