import Button from "@codegouvfr/react-dsfr/Button";
import { useState } from "react";

import PdfExportDownload from ".";
import PdfExportForm from "./PdfExportForm";
import {
  getDefaultSectionSelection,
  hasAtLeastOneSectionSelected,
  type PdfExportSectionId,
  type PdfExportSectionSelection,
} from "./pdfExportSections";

type Props = {
  projectId: string;
  siteId: string;
  onBack: () => void;
};

type ActionButtonProps = {
  selectedSections: PdfExportSectionSelection;
  shouldRenderPdf: boolean;
  isDownloadAvailable: boolean;
  onGenerate: () => void;
  downloadElement: React.ReactNode;
};

function ActionButton({
  selectedSections,
  shouldRenderPdf,
  isDownloadAvailable,
  onGenerate,
  downloadElement,
}: ActionButtonProps) {
  const canGenerate = hasAtLeastOneSectionSelected(selectedSections);

  if (shouldRenderPdf) {
    return (
      <Button type="submit" disabled={!isDownloadAvailable || !canGenerate}>
        {downloadElement}
      </Button>
    );
  }

  return (
    <Button disabled={!canGenerate} onClick={onGenerate}>
      Générer le PDF
    </Button>
  );
}

export default function PdfExportStep({ projectId, siteId, onBack }: Props) {
  const [isDownloadAvailable, setIsDownloadAvailable] = useState(false);
  const [selectedSections, setSelectedSections] = useState<PdfExportSectionSelection>(
    getDefaultSectionSelection,
  );
  const [shouldRenderPdf, setShouldRenderPdf] = useState(false);

  const handleSectionChange = (sectionKey: PdfExportSectionId, checked: boolean) => {
    setSelectedSections((prev) => ({ ...prev, [sectionKey]: checked }));
  };

  const handleGenerate = () => {
    setShouldRenderPdf(true);
  };

  const handleDownloadAvailable = () => {
    setIsDownloadAvailable(true);
  };

  return (
    <div>
      <PdfExportForm selectedSections={selectedSections} onSectionChange={handleSectionChange} />
      {/* we use a negative margin here to compensate Modal padding-bottom */}
      <div className="fr-btns-group fr-btns-group--right fr-btns-group--inline-lg mt-6 -mb-12">
        <Button priority="secondary" onClick={onBack}>
          Retour
        </Button>
        <ActionButton
          selectedSections={selectedSections}
          shouldRenderPdf={shouldRenderPdf}
          isDownloadAvailable={isDownloadAvailable}
          onGenerate={handleGenerate}
          downloadElement={
            <PdfExportDownload
              projectId={projectId}
              siteId={siteId}
              selectedSections={selectedSections}
              onDownloadAvailable={handleDownloadAvailable}
            />
          }
        />
      </div>
    </div>
  );
}
