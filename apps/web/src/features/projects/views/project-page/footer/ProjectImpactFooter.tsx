import Button from "@codegouvfr/react-dsfr/Button";

import { impactsExportModalOpened, trackEvent } from "@/shared/views/analytics";
import classNames from "@/shared/views/clsx";
import { routes } from "@/shared/views/router";

import { exportImpactsModal } from "../export-impacts/createExportModal";
import useDuplicateProject from "../useDuplicateProject";

type Props = {
  siteId: string;
  projectId: string;
  evaluationPeriod?: number;
  isUpdateEnabled: boolean;
};

function ProjectImpactFooter({ projectId, siteId, isUpdateEnabled }: Props) {
  const { onDuplicateProject, duplicationState } = useDuplicateProject(projectId);

  return (
    <div className="mt-6 grid grid-cols-2 gap-6">
      <section className="bg-background-ultralight rounded-lg mt-6 p-6 flex  gap-4 justify-between">
        <img
          src="/img/pictograms/further-actions.svg"
          width="80"
          height="80"
          aria-hidden="true"
          alt=""
          className={classNames("mb-2", "w-34 h-34")}
        />
        <div>
          <h4>Partagez l’évaluation avec vos collègues, partenaires, élu·es...</h4>
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
        </div>
      </section>
      <section className="bg-background-ultralight rounded-lg mt-6 p-6 flex gap-4 justify-between">
        <img
          src="/img/pictograms/evaluate-action.svg"
          width="80"
          height="80"
          aria-hidden="true"
          alt=""
          className={classNames("mb-2", "w-34 h-34")}
        />
        <div>
          <h4>Testez d’autres paramètres et obtenez des impacts différents</h4>
          {isUpdateEnabled ? (
            <Button
              priority="secondary"
              iconId="ri-file-copy-line"
              onClick={onDuplicateProject}
              disabled={duplicationState === "loading"}
              className={duplicationState === "loading" ? "cursor-wait" : undefined}
            >
              Évaluer une variante du projet
            </Button>
          ) : (
            <Button
              priority="secondary"
              iconId="fr-icon-file-add-line"
              linkProps={routes.createProject({ siteId }).link}
            >
              Créer un nouveau projet sur le site
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProjectImpactFooter;
