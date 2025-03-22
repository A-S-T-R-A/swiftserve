import { Button } from "@/shared/ui/button";
import { printSummary } from "../model/services";

export function PrintSummaryButton({ id }: { id: number }) {
  async function clickHandler() {
    const response = await printSummary({ id });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "summary.pdf";
    link.click();
  }

  return (
    <Button className="w-fit" onClick={clickHandler}>
      Print Summary
    </Button>
  );
}
