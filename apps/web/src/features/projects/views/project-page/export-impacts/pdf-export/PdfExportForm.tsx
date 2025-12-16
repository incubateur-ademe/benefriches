import Checkbox from "@codegouvfr/react-dsfr/Checkbox";

import {
  pdfExportSectionIdSchema,
  PDF_EXPORT_SECTION_LABELS,
  type PdfExportSectionId,
  type PdfExportSectionSelection,
} from "./pdfExportSections";

type Props = {
  selectedSections: PdfExportSectionSelection;
  onSectionChange: (key: PdfExportSectionId, checked: boolean) => void;
};

export default function PdfExportForm({ selectedSections, onSectionChange }: Props) {
  return (
    <Checkbox
      legend="Quelles informations souhaitez-vous inclure dans le PDF ?"
      options={pdfExportSectionIdSchema.options.map((sectionKey) => ({
        label: PDF_EXPORT_SECTION_LABELS[sectionKey],
        nativeInputProps: {
          checked: selectedSections[sectionKey],
          onChange: (e) => {
            onSectionChange(sectionKey, e.target.checked);
          },
        },
      }))}
    />
  );
}
