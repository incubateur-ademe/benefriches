import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import Dropdown from "antd/es/dropdown/dropdown";

import {
  ProjectDevelopmentPlanType,
  ProjectFeatures,
} from "@/features/projects/domain/projects.types";
import classNames from "@/shared/views/clsx";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";

import { getScenarioPictoUrl } from "../../shared/scenarioType";
import ExpressProjectTooltipBadge from "./../ExpressProjectBadge";
import ProjectFeaturesView from "./../features/ProjectFeaturesView";
import AboutImpactsModalContent from "./../impacts/AboutImpactsModalContent";

type Props = {
  projectName: string;
  projectFeaturesData?: ProjectFeatures;
  onFetchProjectFeatures?: () => void;
  siteFeaturesHref: string;
  siteName: string;
  projectType?: ProjectDevelopmentPlanType;
  onGoToImpactsOnBoarding: () => void;
  isExpressProject: boolean;
  isFloatingHeader?: boolean;
  isSmScreen?: boolean;
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
  projectFeaturesData,
  onFetchProjectFeatures,
  siteName,
  siteFeaturesHref,
  onGoToImpactsOnBoarding,
  projectType,
  isExpressProject,
  isFloatingHeader = false,
  isSmScreen = false,
}: Props) => {
  return (
    <div className={fr.cx("fr-container")}>
      <div
        className={classNames(
          "tw-flex tw-justify-between tw-items-center",
          !isFloatingHeader && "tw-my-4",
        )}
      >
        <div className="tw-flex tw-items-center">
          {projectType && (
            <img
              className={classNames(
                "tw-mr-3",
                isFloatingHeader
                  ? "tw-w-[60px] tw-h-[60px]"
                  : "tw-w-[60px] tw-h-[60px] md:tw-w-[72px] md:tw-h-[72px]",
              )}
              src={getScenarioPictoUrl(projectType)}
              aria-hidden={true}
              alt="Icône du type de scénario"
              width="60"
              height="60"
            />
          )}

          <div>
            <div className="sm:tw-inline-flex tw-items-center">
              <h2
                className={classNames("tw-my-0", isFloatingHeader || (isSmScreen && "tw-text-2xl"))}
              >
                {projectName}
              </h2>
              {isExpressProject && !(isFloatingHeader && isSmScreen) && (
                <ExpressProjectTooltipBadge siteName={siteName} />
              )}
            </div>
            <div className={classNames(!isFloatingHeader && "tw-mt-1")}>
              <span
                className={classNames(
                  fr.cx(
                    "fr-icon-map-pin-2-line",
                    "fr-icon--sm",
                    isFloatingHeader ? "fr-mr-1w" : "fr-mr-0-5v",
                  ),
                )}
                aria-hidden="true"
              ></span>
              <a
                href={siteFeaturesHref}
                className={classNames(
                  fr.cx("fr-text--lg"),
                  isFloatingHeader && "tw-text-lg tw-mb-0",
                )}
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
                if (onFetchProjectFeatures) {
                  onFetchProjectFeatures();
                }
                featuresModal.open();
              }
              if (key === "go-to-impacts-onboarding") {
                onGoToImpactsOnBoarding();
              }
            },
          }}
        >
          <Button
            size={isSmScreen ? "small" : "medium"}
            priority="secondary"
            iconId="fr-icon-more-fill"
            title="Voir plus de fonctionnalités"
          />
        </Dropdown>
        <aboutImpactsModal.Component title="À propos des indicateurs d’impact" size="large">
          <AboutImpactsModalContent />
        </aboutImpactsModal.Component>
        <featuresModal.Component title="Caractéristiques du projet" size="large">
          {projectFeaturesData ? (
            <ProjectFeaturesView projectData={projectFeaturesData} />
          ) : (
            <LoadingSpinner />
          )}
        </featuresModal.Component>
      </div>
    </div>
  );
};

export default ProjectPageHeader;
