import { useEffect } from "react";
import { UserTable } from "./UserTable";
import { useUserStore } from "@/entities/User";
import { useQuery } from "@tanstack/react-query";
import { columns } from "../const/columns";
import { getUsers } from "../services/getUsers";

export function UserDashboardTable() {
  const { users, setUsers } = useUserStore();

  const { isPending, error, data } = useQuery({
    queryKey: ["usersData"],
    queryFn: getUsers,
  });

  useEffect(() => {
    if (data) setUsers(data);
  }, [data]);

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return <UserTable columns={columns} data={users} />;
}
