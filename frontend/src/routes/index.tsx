import { createFileRoute } from "@tanstack/react-router";
import { Main } from "@/shared/ui/main";
import { UserDashboardTable } from "@/widgets/UserDashboard";
import { AppHeader } from "@/widgets/AppHeader";
// import { DownloadUsers } from "@/features/DownloadUsers";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div>
      <AppHeader />
      <Main>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Appointment Management Dashboard
          </h1>
          {/* <div className="flex items-center space-x-2">
            <DownloadUsers />
          </div> */}
        </div>

        <UserDashboardTable />
      </Main>
    </div>
  );
}
