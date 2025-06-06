import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect } from "react";

import { selectExportImpactsView } from "@/features/projects/application/exportImpacts.selectors";
import { fetchProjectFeatures } from "@/features/projects/application/project-features/projectFeatures.actions";
import { fetchSiteFeatures } from "@/features/site-features/core/fetchSiteFeatures.action";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import PdfExportDocument from "../pdf-export";

const octetsToKo = (octets: number) => octets / 1000;

type Props = {
  projectId: string;
  siteId: string;
};

export default function PdfExportDownloadButton({ projectId, siteId }: Props) {
  const dispatch = useAppDispatch();
  const { loadingState, projectFeatures, siteFeatures, impacts } =
    useAppSelector(selectExportImpactsView);

  useEffect(() => {
    void dispatch(fetchProjectFeatures({ projectId }));
    void dispatch(fetchSiteFeatures({ siteId }));
  }, [dispatch, projectId, siteId]);

  if (loadingState === "error") return "Erreur lors de la génération du document.";

  if (loadingState === "idle" || loadingState === "loading") return "Génération du document...";

  if (!projectFeatures || !siteFeatures) {
    return "Erreur lors de la génération du document.";
  }

  return (
    <PDFDownloadLink
      document={
        <PdfExportDocument
          siteFeatures={siteFeatures}
          projectFeatures={projectFeatures}
          impacts={impacts}
        />
      }
      fileName={`Export Bénéfriches ${new Date().toLocaleDateString()} - Projet ${projectFeatures.name}.pdf`}
    >
      {({ blob, loading }) =>
        loading
          ? "Génération du document..."
          : `Télécharger l'export (${formatNumberFr(octetsToKo(blob?.size ?? 0))} ko)`
      }
    </PDFDownloadLink>
  );
}
