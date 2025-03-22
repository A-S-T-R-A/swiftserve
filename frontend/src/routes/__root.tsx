import { Outlet, createRootRoute } from "@tanstack/react-router";
import { cn } from "@/shared/lib/utils";
import { SidebarProvider } from "@/shared/ui/sidebar";
import { AppSidebar } from "@/widgets/AppSidebar";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/entities/User";
import { getUsers } from "@/entities/User/model/getUsers";

export const Route = createRootRoute({
  component: () => {
    const { setUsers } = useUserStore();

    const { data } = useQuery({
      queryKey: ["usersData"],
      queryFn: getUsers,
    });

    useEffect(() => {
      if (data) setUsers(data);
    }, [data]);
    return (
      <>
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <div
            id="content"
            className={cn(
              "ml-auto w-full max-w-full",
              "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
              "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
              "transition-[width] duration-200 ease-linear",
              "flex h-svh flex-col",
              "group-data-[scroll-locked=1]/body:h-full",
              "group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh"
            )}
          >
            <Outlet />
          </div>
        </SidebarProvider>
      </>
    );
  },
});
