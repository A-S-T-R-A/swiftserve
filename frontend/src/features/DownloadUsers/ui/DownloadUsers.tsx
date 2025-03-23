import { Button } from "@/shared/ui/button";
import { downloadJsonToCsv } from "../lib/downloadJsonToCsv";
import { usePatientStore } from "@/entities/Patient";

export function DownloadUsers() {
  const { patients } = usePatientStore();

  return <Button onClick={() => downloadJsonToCsv(patients)}>Download</Button>;
}
