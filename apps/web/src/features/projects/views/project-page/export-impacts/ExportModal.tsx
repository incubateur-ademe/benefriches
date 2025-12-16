import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import { useState } from "react";

import ExportFormatSelector from "./ExportFormatSelector";
import { exportImpactsModal } from "./createExportModal";
import type { ExportOption } from "./exportModal.types";
import PdfExportStep from "./pdf-export/PdfExportStep";

type Props = {
  projectId: string;
  siteId: string;
};

export default function ExportImpactsModal({ projectId, siteId }: Props) {
  const [exportOption, setExportOption] = useState<ExportOption | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState<"format_selection" | "pdf_export_form">(
    "format_selection",
  );

  const resetState = () => {
    setExportOption(undefined);
    setCurrentStep("format_selection");
  };

  const goBack = () => {
    setCurrentStep("format_selection");
  };

  useIsModalOpen(exportImpactsModal, {
    onConceal: resetState,
  });

  const actionButton =
    exportOption === "pdf"
      ? {
          children: "Suivant",
          doClosesModal: false,
          disabled: false,
          type: "button" as const,
          onClick: () => {
            setCurrentStep("pdf_export_form");
          },
        }
      : {
          children: "Télécharger",
          doClosesModal: false,
          disabled: exportOption === undefined,
          type: "submit" as const,
        };

  return (
    <exportImpactsModal.Component
      title="Télécharger les impacts du projet"
      iconId="fr-icon-file-download-line"
      buttons={
        currentStep === "format_selection"
          ? [
              {
                children: "Annuler",
                doClosesModal: true,
                type: "button",
              },
              actionButton,
            ]
          : undefined
      }
    >
      {currentStep === "format_selection" && (
        <ExportFormatSelector value={exportOption} onChange={setExportOption} />
      )}
      {currentStep === "pdf_export_form" && (
        <PdfExportStep projectId={projectId} siteId={siteId} onBack={goBack} />
      )}
    </exportImpactsModal.Component>
  );
}
