import { MedicalCard } from "../entities/MedicalCard";
import { ExportPDF } from "../features/PdfExport";

export const App = () => {
  return (
    <div>
      <MedicalCard />
      <ExportPDF />
    </div>
  );
};
