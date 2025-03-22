import { IconLayoutDashboard } from "@tabler/icons-react";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
import type { SidebarData } from "../model/types";

export const mockSidebarData: SidebarData = {
  user: {
    name: "SwiftScribe AI",
    email: "swiftscribe@gmail.com",
    avatar: "",
  },
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Appointment Management",
          url: "/",
          icon: IconLayoutDashboard,
        },
      ],
    },
  ],
};
