import Button from "@codegouvfr/react-dsfr/Button";

import { impactsExportModalOpened, trackEvent } from "@/shared/views/analytics";
import TileLink from "@/shared/views/components/TileLink/TileLink";
import { routes } from "@/shared/views/router";

import { exportImpactsModal } from "../export-impacts/createExportModal";
import { aboutImpactsModal } from "../impacts/about-impacts-modal";
import { projectFeaturesModal } from "../impacts/project-features-modal/createProjectFeaturesModal";
import { siteFeaturesModal } from "../impacts/site-features-modal/createSiteFeaturesModal";
import ImpactComparisonSection from "./compare-impacts";
import TileDuplicateProject from "./duplicate-impacts";

type Props = {
  siteId: string;
  projectId: string;
  evaluationPeriod?: number;
};

function ProjectImpactFooter({ siteId, projectId, evaluationPeriod }: Props) {
  return (
    <>
      <ImpactComparisonSection projectId={projectId} evaluationPeriod={evaluationPeriod} />

      <p className="tw-text-lg tw-font-bold">Aller plus loin avec ce projet :</p>
      <div className="tw-grid md:tw-grid-cols-3 tw-gap-3 md:tw-gap-6 tw-pb-6">
        <TileLink
          title="Exporter les impacts du projet"
          iconId="fr-icon-file-download-line"
          onClick={() => {
            trackEvent(impactsExportModalOpened());
            exportImpactsModal.open();
          }}
        />
        <TileDuplicateProject />
        <TileLink
          title="Créer un nouveau projet sur ce site"
          iconId="fr-icon-add-line"
          onClick={() => {
            routes.createProject({ siteId }).push();
          }}
        />
      </div>

      <div className="tw-p-6 tw-bg-white dark:tw-bg-black tw-border tw-border-solid tw-border-borderGrey tw-flex tw-flex-col md:tw-flex-row tw-gap-6">
        <img
          src="/img/pictograms/calculatrice-illustration.svg"
          alt="illustration calcul"
          aria-hidden="true"
          className="tw-w-36"
        />
        <div className="tw-flex tw-flex-col tw-justify-center">
          <h3 className="tw-mb-0">
            Les réponses à vos questions concernant les impacts de votre projet
          </h3>

          <Button
            priority="primary"
            className="tw-my-4"
            onClick={() => {
              aboutImpactsModal.open();
            }}
          >
            Comprendre les calculs
          </Button>
          <div className="tw-flex tw-flex-col md:tw-flex-row  md:tw-gap-2">
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
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectImpactFooter;
