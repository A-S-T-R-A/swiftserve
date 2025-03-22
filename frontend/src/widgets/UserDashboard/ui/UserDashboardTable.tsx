import { UserTable } from "./UserTable";
import { useUserStore } from "@/entities/User";
import { useQuery } from "@tanstack/react-query";
import { columns } from "../const/columns";

export function UserDashboardTable() {
  const { users } = useUserStore();

  const { isPending, error } = useQuery({
    queryKey: ["usersData"],
    enabled: false,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return <UserTable columns={columns} data={users} />;
}
