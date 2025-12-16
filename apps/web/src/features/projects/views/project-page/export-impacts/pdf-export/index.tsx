import { usePDF } from "@react-pdf/renderer";
import { useEffect } from "react";
import { roundToInteger } from "shared";

import { fetchProjectFeatures } from "@/features/projects/application/project-features/projectFeatures.actions";
import { selectExportImpactsView } from "@/features/projects/application/project-impacts/exportImpacts.selectors";
import { fetchSiteFeatures } from "@/features/sites/core/fetchSiteFeatures.action";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import { impactsExportDownloaded, trackEvent } from "@/shared/views/analytics";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { Props as ImpactsPdfDocumentProps } from "../../pdf-export";
import PdfExportDocument from "../../pdf-export";
import type { PdfExportSectionSelection } from "./pdfExportSections";

const octetsToKo = (octets: number) => octets / 1000;

const formatFileSize = (sizeInOctets: number) => {
  const sizeInKo = octetsToKo(sizeInOctets);
  const roundedSize = roundToInteger(sizeInKo);
  return `${formatNumberFr(roundedSize)} ko`;
};

type Props = {
  projectId: string;
  siteId: string;
  selectedSections: PdfExportSectionSelection;
  onDownloadAvailable: () => void;
};

type PdfDownloadProps = {
  onDownloadAvailable: () => void;
  selectedSections: PdfExportSectionSelection;
} & ImpactsPdfDocumentProps;

const PdfDownload = ({
  siteFeatures,
  projectFeatures,
  impacts,
  evaluationPeriodInYears,
  selectedSections,
  onDownloadAvailable,
}: PdfDownloadProps) => {
  const [instance] = usePDF({
    document: (
      <PdfExportDocument
        siteFeatures={siteFeatures}
        projectFeatures={projectFeatures}
        impacts={impacts}
        evaluationPeriodInYears={evaluationPeriodInYears}
        selectedSections={selectedSections}
      />
    ),
  });

  useEffect(() => {
    if (instance.url) onDownloadAvailable();
  }, [instance.url, onDownloadAvailable]);

  if (instance.loading) return "Génération du document...";

  if (instance.error) return "Erreur lors de la génération du document.";

  if (instance.url) {
    return (
      <a
        href={instance.url}
        download={`Export Bénéfriches ${new Date().toLocaleDateString()} - Projet ${projectFeatures.name}.pdf`}
        onClick={() => {
          trackEvent(impactsExportDownloaded("pdf"));
        }}
      >
        Télécharger le document ({formatFileSize(instance.blob?.size ?? 0)})
      </a>
    );
  }
};

export default function PdfExportDownloadContainer({
  projectId,
  siteId,
  selectedSections,
  onDownloadAvailable,
}: Props) {
  const dispatch = useAppDispatch();
  const { loadingState, evaluationPeriodInYears, projectFeatures, siteFeatures, impacts } =
    useAppSelector(selectExportImpactsView);
  useEffect(() => {
    void dispatch(fetchProjectFeatures({ projectId }));
    void dispatch(fetchSiteFeatures({ siteId }));
  }, [dispatch, projectId, siteId]);

  if (loadingState === "idle" || loadingState === "loading") return "Génération du document...";

  if (loadingState === "error" || !projectFeatures || !siteFeatures)
    return "Erreur lors de la génération du document.";

  return (
    <PdfDownload
      siteFeatures={siteFeatures}
      projectFeatures={projectFeatures}
      impacts={impacts}
      evaluationPeriodInYears={evaluationPeriodInYears as number}
      selectedSections={selectedSections}
      onDownloadAvailable={onDownloadAvailable}
    />
  );
}
