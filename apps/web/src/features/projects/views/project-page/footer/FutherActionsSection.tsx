import Button from "@codegouvfr/react-dsfr/Button";

import { impactsExportModalOpened, trackEvent } from "@/shared/views/analytics";
import { routes } from "@/shared/views/router";

import { exportImpactsModal } from "../export-impacts/createExportModal";
import { aboutImpactsModal } from "../impacts/about-impacts-modal";
import { projectFeaturesModal } from "../impacts/project-features-modal/createProjectFeaturesModal";
import { siteFeaturesModal } from "../impacts/site-features-modal/createSiteFeaturesModal";

export default function FurtherActionsSection({ siteId }: { siteId: string }) {
  return (
    <section className="tw-rounded-lg tw-mt-10 tw-p-6 tw-bg-white dark:tw-bg-black tw-border tw-border-solid tw-border-borderGrey tw-flex tw-flex-col md:tw-flex-row tw-gap-6">
      <img
        src="/img/pictograms/further-actions.svg"
        alt=""
        aria-hidden="true"
        className="tw-w-36"
      />
      <div className="tw-flex tw-flex-col tw-justify-center">
        <h3 className="tw-mb-0">Aller plus loin avec ce projet</h3>
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-4 tw-mt-4">
          <Button
            priority="primary"
            iconId="fr-icon-external-link-line"
            onClick={() => {
              trackEvent(impactsExportModalOpened());
              exportImpactsModal.open();
            }}
          >
            Exporter les impacts
          </Button>
          <Button priority="secondary" iconId="fr-icon-edit-fill" disabled>
            Modifier les informations
          </Button>
        </div>
        <div className="md:tw-flex tw-gap-2 tw-mt-4">
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
            iconId="fr-icon-map-pin-2-line"
            priority="tertiary no outline"
            onClick={() => {
              siteFeaturesModal.open();
            }}
          >
            Revoir les données du site
          </Button>
          <Button
            size="small"
            iconId="fr-icon-briefcase-line"
            priority="tertiary no outline"
            onClick={() => {
              projectFeaturesModal.open();
            }}
          >
            Revoir les données du projet
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
