import { Button } from "@/shared/ui/button";
import { downloadJsonToCsv } from "../lib/downloadJsonToCsv";
import { useUserStore } from "@/entities/Patient";

export function DownloadUsers() {
  const { users } = useUserStore();

  return <Button onClick={() => downloadJsonToCsv(users)}>Download</Button>;
}
