import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import { useState } from "react";

import Badge from "@/shared/views/components/Badge/Badge";

import { exportImpactsModal } from "./createExportModal";
import PdfExportDownload from "./pdf-export";

type ExportOption = "pdf" | "sharing_link" | "excel";

function UnavailableExportOption({ label }: { label: string }) {
  return (
    <span>
      <span>{label}</span>
      <Badge small className="ml-3" style="green-tilleul">
        Bientôt disponible
      </Badge>
    </span>
  );
}

type Props = {
  projectId: string;
  siteId: string;
};

export default function ExportImpactsModal({ projectId, siteId }: Props) {
  const [isDownloadAvailable, setIsDownloadAvailable] = useState(false);
  const [exportOption, setExportOption] = useState<ExportOption | undefined>(undefined);

  const resetSelectedOption = () => {
    setExportOption(undefined);
    setIsDownloadAvailable(false);
  };

  useIsModalOpen(exportImpactsModal, {
    onConceal: resetSelectedOption,
  });

  return (
    <exportImpactsModal.Component
      title="Télécharger les impacts du projet"
      iconId="fr-icon-file-download-line"
      buttons={[
        {
          children: "Annuler",
          doClosesModal: true,
          type: "button",
        },
        exportOption === "pdf"
          ? {
              children: (
                <PdfExportDownload
                  projectId={projectId}
                  siteId={siteId}
                  onDownloadAvailable={() => {
                    setIsDownloadAvailable(true);
                  }}
                />
              ),
              doClosesModal: false,
              disabled: !isDownloadAvailable,
              type: "submit",
            }
          : {
              children: "Télécharger",
              doClosesModal: false,
              disabled: exportOption == undefined,
              type: "submit",
            },
      ]}
    >
      <RadioButtons
        legend="Dans quel format souhaitez-vous télécharger les impacts du projet ?"
        options={[
          {
            label: "PDF",
            nativeInputProps: {
              checked: exportOption === "pdf",
              onChange: () => {
                setExportOption("pdf");
              },
            },
          },
          {
            label: <UnavailableExportOption label="Tableur Excel" />,
            nativeInputProps: {
              checked: exportOption === "excel",
              onChange: () => {
                setExportOption("excel");
              },
              disabled: true,
            },
          },
          {
            label: <UnavailableExportOption label="Lien à partager" />,
            nativeInputProps: {
              checked: exportOption === "sharing_link",
              onChange: () => {
                setExportOption("sharing_link");
              },
              disabled: true,
            },
          },
        ]}
      />
    </exportImpactsModal.Component>
  );
}
