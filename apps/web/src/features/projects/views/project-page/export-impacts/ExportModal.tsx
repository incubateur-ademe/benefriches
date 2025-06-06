import { useIsModalOpen } from "@codegouvfr/react-dsfr/Modal/useIsModalOpen";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import { useState } from "react";

import Badge from "@/shared/views/components/Badge/Badge";

import PdfExportDownloadButton from "./PdfExportDownloadButton";
import { exportImpactsModal } from "./createExportModal";

type ExportOption = "pdf" | "sharing_link" | "excel";

function UnavailableExportOption({ label }: { label: string }) {
  return (
    <span>
      <span>{label}</span>
      <Badge small className="tw-ml-3" style="green-emeraude">
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
  const [exportOption, setExportOption] = useState<ExportOption | undefined>(undefined);
  const resetSelectedOption = () => {
    setExportOption(undefined);
  };

  useIsModalOpen(exportImpactsModal, {
    onConceal: resetSelectedOption,
  });

  return (
    <exportImpactsModal.Component
      title="Exporter les impacts du projet"
      iconId="fr-icon-file-download-line"
      buttons={[
        {
          children: "Annuler",
          doClosesModal: true,
          type: "button",
        },
        {
          children:
            exportOption === "pdf" ? (
              <PdfExportDownloadButton projectId={projectId} siteId={siteId} />
            ) : (
              "Exporter"
            ),
          disabled: exportOption == undefined,
          doClosesModal: true,
          type: "submit",
        },
      ]}
    >
      <RadioButtons
        legend="Dans quel format souhaitez-vous exporter les impacts du projet ?"
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
