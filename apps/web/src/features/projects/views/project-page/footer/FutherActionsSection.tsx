import Button from "@codegouvfr/react-dsfr/Button";

import { impactsExportModalOpened, trackEvent } from "@/shared/views/analytics";
import { routes } from "@/shared/views/router";

import { exportImpactsModal } from "../export-impacts/createExportModal";
import { aboutImpactsModal } from "../impacts/about-impacts-modal";
import { projectAndSiteFeaturesModal } from "../impacts/project-and-site-features-modal/createProjectAndSiteFeaturesModal";

export default function FurtherActionsSection({ siteId }: { siteId: string }) {
  return (
    <section className="rounded-lg mt-10 p-6 bg-white dark:bg-black border border-solid border-border-grey flex flex-col md:flex-row gap-6">
      <img src="/img/pictograms/further-actions.svg" alt="" aria-hidden="true" className="w-36" />
      <div className="flex flex-col justify-center">
        <h3 className="mb-0">Aller plus loin avec ce projet</h3>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
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
          <Button priority="secondary" iconId="fr-icon-edit-fill" disabled>
            Modifier les informations
          </Button>
        </div>
        <div className="md:flex gap-2 mt-4">
          <Button
            size="small"
            iconId="fr-icon-file-add-line"
            priority="tertiary no outline"
            onClick={() => {
              routes.createProject({ siteId }).push();
            }}
          >
            Créer une variante du projet
          </Button>
          <Button
            size="small"
            iconId="fr-icon-file-text-line"
            priority="tertiary no outline"
            onClick={() => {
              projectAndSiteFeaturesModal.open();
            }}
          >
            Revoir les données du site et du projet
          </Button>
          <Button
            size="small"
            iconId="fr-icon-lightbulb-line"
            priority="tertiary no outline"
            onClick={() => {
              aboutImpactsModal.open();
            }}
          >
            Comprendre les calculs
          </Button>
        </div>
      </div>
    </section>
  );
}
