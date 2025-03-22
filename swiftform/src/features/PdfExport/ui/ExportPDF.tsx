// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import { Button } from "@/shared/ui/Button";

export const ExportPDF = () => {
  //   const handleDownload = async () => {
  //     const element = document.querySelector("#pdfContainer");
  //     if (!element) return;

  //     const canvas = await html2canvas(element);
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format: "a4",
  //     });

  //     pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
  //     pdf.save("medical-record.pdf");
  //   };

  return (
    <Button
    //   onClick={handleDownload}
    >
      {" "}
      Export to PDF
    </Button>
  );
};
