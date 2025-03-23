import { createFileRoute } from "@tanstack/react-router";
import { Main } from "@/shared/ui/main";
import { UserDashboardTable } from "@/widgets/UserDashboard";
import { AppHeader } from "@/widgets/AppHeader";
import { CreatePatient } from "@/features/CreatePatient";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div>
      <AppHeader />
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Patients</h1>

          <CreatePatient />
        </div>

        <UserDashboardTable />
      </Main>
    </div>
  );
}
