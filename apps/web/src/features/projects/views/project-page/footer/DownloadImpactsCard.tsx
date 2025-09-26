import Button from "@codegouvfr/react-dsfr/Button";

import { impactsExportModalOpened, trackEvent } from "@/shared/views/analytics";

import { exportImpactsModal } from "../export-impacts/createExportModal";

function DownloadImpactsCard() {
  return (
    <section className="bg-[#DAF2FB] dark:bg-[#0E3D4F] rounded-lg mt-6 p-6 flex flex-col justify-between">
      <h4>Partagez les résultats avec vos collègues, partenaires, élu·es...</h4>
      <Button
        priority="primary"
        iconId="fr-icon-file-download-line"
        onClick={() => {
          trackEvent(impactsExportModalOpened());
          exportImpactsModal.open();
        }}
      >
        Télécharger les impacts
      </Button>
    </section>
  );
}

export default DownloadImpactsCard;
