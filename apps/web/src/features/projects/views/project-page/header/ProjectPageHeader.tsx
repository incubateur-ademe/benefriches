import { fr } from "@codegouvfr/react-dsfr";

import { ProjectDevelopmentPlanType } from "@/features/projects/domain/projects.types";
import classNames from "@/shared/views/clsx";
import DropdownMenu from "@/shared/views/components/Menu/DropdownMenu";
import { useIsSmallScreen } from "@/shared/views/hooks/useIsSmallScreen";

import { getScenarioPictoUrl } from "../../shared/scenarioType";
import { aboutImpactsModal } from "../impacts/about-impacts-modal";
import { projectFeaturesModal } from "../impacts/project-features-modal/createProjectFeaturesModal";
import ExpressProjectTooltipBadge from "./../ExpressProjectBadge";

export type HeaderProps = {
  projectName: string;
  siteFeaturesHref: string;
  siteName: string;
  projectType?: ProjectDevelopmentPlanType;
  onGoToImpactsOnBoarding: () => void;
  isExpressProject: boolean;
  size?: "small" | "medium";
};

const ProjectPageHeader = ({
  projectName,
  siteName,
  siteFeaturesHref,
  onGoToImpactsOnBoarding,
  projectType,
  isExpressProject,
  size: propsSize,
}: HeaderProps) => {
  const isSmallScreen = useIsSmallScreen();
  const size = propsSize ?? (isSmallScreen ? "small" : "medium");
  const isSmallSize = size === "small";
  return (
    <div className={fr.cx("fr-container")}>
      <div
        className={classNames(
          "tw-grid",
          "tw-grid-cols-[60px_1fr_32px]",
          "md:tw-grid-cols-[72px_1fr_40px]",
          "tw-gap-x-2 md:tw-gap-x-3",
          "tw-items-center",
          "tw-justify-center",
        )}
      >
        {projectType && (
          <img
            className={classNames(
              "tw-col-start-1",
              "sm:tw-row-start-1",
              "sm:tw-row-span-2",
              isSmallSize ? "tw-w-[60px] tw-h-[60px]" : "md:tw-w-[72px] md:tw-h-[72px]",
            )}
            src={getScenarioPictoUrl(projectType)}
            aria-hidden={true}
            alt="Icône du type de scénario"
            width="60"
            height="60"
          />
        )}

        <div className="tw-col-start-2 sm:tw-inline-flex tw-items-center">
          <h2 className={classNames("tw-my-0", isSmallSize && "tw-text-2xl")}>{projectName}</h2>
          {isExpressProject && !isSmallScreen && <ExpressProjectTooltipBadge siteName={siteName} />}
        </div>
        <div
          className={classNames(
            "tw-row-start-2",
            "tw-col-start-1 sm:tw-col-start-2",
            "tw-col-span-3 sm:tw-col-span-1",
          )}
        >
          <span
            className={classNames(
              fr.cx(
                "fr-icon-map-pin-2-line",
                "fr-icon--sm",
                isSmallSize ? "fr-mr-1w" : "fr-mr-0-5v",
              ),
            )}
            aria-hidden="true"
          ></span>
          <a href={siteFeaturesHref} className="tw-text-base">
            {siteName}
          </a>
        </div>
        <div className="tw-col-start-3 sm:tw-row-span-2">
          <DropdownMenu
            size="large"
            buttonProps={{
              size: size,
              priority: "secondary",
              iconId: "fr-icon-more-fill",
              title: "Voir plus de fonctionnalités",
            }}
            options={[
              {
                children: "Consulter les caractéristiques du projet",
                iconId: "fr-icon-file-text-line",
                onClick: () => {
                  projectFeaturesModal.open();
                },
              },
              {
                children: "Comprendre les impacts",
                iconId: "fr-icon-information-line",
                onClick: () => {
                  aboutImpactsModal.open();
                },
              },
              {
                children: "Revoir l'introduction",
                iconId: "fr-icon-arrow-go-back-line",
                onClick: () => {
                  onGoToImpactsOnBoarding();
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectPageHeader;
