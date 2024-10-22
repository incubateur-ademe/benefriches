import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import Dropdown from "antd/es/dropdown/dropdown";

import { routes } from "@/app/views/router";
import classNames from "@/shared/views/clsx";

import { ProjectDevelopmentPlanType } from "../../domain/projects.types";
import { getScenarioPictoUrl } from "../shared/scenarioType";
import ExpressProjectTooltipBadge from "./ExpressProjectBadge";
import ProjectFeaturesView from "./features";
import AboutImpactsModalContent from "./impacts/AboutImpactsModalContent";

type Props = {
  projectName: string;
  projectId: string;
  siteName: string;
  siteId: string;
  projectType?: ProjectDevelopmentPlanType;
  isExpressProject: boolean;
  isSmall?: boolean;
};

const aboutImpactsModal = createModal({
  id: "about-benefriches-impacts-modal",
  isOpenedByDefault: false,
});

const featuresModal = createModal({
  id: "project-features-modal",
  isOpenedByDefault: false,
});

const ProjectPageHeader = ({
  projectName,
  projectId,
  siteName,
  siteId,
  projectType,
  isExpressProject,
  isSmall = false,
}: Props) => {
  return (
    <div className={fr.cx("fr-container")}>
      <div
        className={classNames(
          "sm:tw-flex tw-justify-between tw-items-center",
          !isSmall && "tw-my-4",
        )}
      >
        <div className="tw-flex tw-items-center">
          {projectType && (
            <img
              className={fr.cx("fr-mr-3v")}
              src={getScenarioPictoUrl(projectType)}
              aria-hidden={true}
              alt="Icône du type de scénario"
              width={isSmall ? 60 : 76}
              height={isSmall ? 60 : 76}
            />
          )}

          <div>
            <div className="sm:tw-inline-flex tw-items-center">
              <h2 className={classNames("tw-my-0", isSmall && "tw-text-2xl")}>{projectName}</h2>
              {isExpressProject && <ExpressProjectTooltipBadge siteName={siteName} />}
            </div>
            <div className={classNames(!isSmall && "tw-mt-1")}>
              <span
                className={classNames(
                  fr.cx(
                    "fr-icon-map-pin-2-line",
                    "fr-icon--sm",
                    isSmall ? "fr-mr-1w" : "fr-mr-0-5v",
                  ),
                )}
                aria-hidden="true"
              ></span>
              <a
                href={routes.siteFeatures({ siteId }).href}
                className={classNames(fr.cx("fr-text--lg"), isSmall && "tw-text-lg tw-mb-0")}
              >
                {siteName}
              </a>
            </div>
          </div>
        </div>
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                label: "Consulter les caractéristiques du projet",
                icon: (
                  <span className="fr-icon--sm fr-icon-file-text-line" aria-hidden="true"></span>
                ),
                key: "project-features",
              },
              {
                label: "À propos des indicateurs d’impact",
                icon: (
                  <span className="fr-icon--sm fr-icon-information-line" aria-hidden="true"></span>
                ),
                key: "about-impacts",
              },
              {
                label: "Revoir l'introduction",
                icon: (
                  <span
                    className="fr-icon--sm fr-icon-arrow-go-back-line"
                    aria-hidden="true"
                  ></span>
                ),
                key: "go-to-impacts-onboarding",
              },
            ],

            onClick: ({ key }) => {
              if (key === "about-impacts") {
                aboutImpactsModal.open();
              }
              if (key === "project-features") {
                featuresModal.open();
              }
              if (key === "go-to-impacts-onboarding") {
                routes.projectImpactsOnboarding({ projectId }).push();
              }
            },
          }}
        >
          <Button
            priority="secondary"
            iconId="fr-icon-more-fill"
            title="Voir plus de fonctionnalités"
          />
        </Dropdown>
        <aboutImpactsModal.Component title="À propos des indicateurs d’impact" size="large">
          <AboutImpactsModalContent />
        </aboutImpactsModal.Component>
        <featuresModal.Component title="Caractéristiques du projet" size="large">
          <ProjectFeaturesView projectId={projectId} />
        </featuresModal.Component>
      </div>
    </div>
  );
};

export default ProjectPageHeader;
