import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";

import { ProjectDevelopmentPlanType } from "@/features/projects/domain/projects.types";
import classNames, { ClassValue } from "@/shared/views/clsx";
import { useIsSmallScreen } from "@/shared/views/hooks/useIsSmallScreen";

import { getScenarioPictoUrl } from "../../shared/scenarioType";
import { exportImpactsModal } from "../export-impacts/createExportModal";
import ExpressProjectTooltipBadge from "./../ExpressProjectBadge";

export type HeaderProps = {
  projectName: string;
  siteFeaturesHref: string;
  siteName: string;
  projectType?: ProjectDevelopmentPlanType;
  isExpressProject: boolean;
  size?: "small" | "medium";
  className?: ClassValue;
};

const ProjectPageHeader = ({
  projectName,
  siteName,
  siteFeaturesHref,
  projectType,
  isExpressProject,
  size: propsSize,
  className,
}: HeaderProps) => {
  const isSmallScreen = useIsSmallScreen();
  const size = propsSize ?? (isSmallScreen ? "small" : "medium");
  const isSmallSize = size === "small";
  return (
    <div className={classNames(fr.cx("fr-container"), className)}>
      <div
        className={classNames(
          "tw-flex tw-flex-col tw-gap-2",
          "md:tw-grid md:tw-grid-cols-[72px_1fr_240px] md:tw-gap-x-3",
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
            alt=""
            width="60"
            height="60"
          />
        )}

        <div className="tw-col-start-2 sm:tw-inline-flex tw-items-center">
          <h2 className={classNames("tw-my-0", isSmallSize && "tw-text-2xl")}>{projectName}</h2>
          {isExpressProject && !isSmallScreen && <ExpressProjectTooltipBadge />}
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
        <div className="md:tw-col-start-3 md:tw-row-span-3 tw-flex tw-items-center md:tw-justify-end">
          <Button
            priority="primary"
            iconId="fr-icon-external-link-line"
            size={size}
            onClick={() => {
              exportImpactsModal.open();
            }}
          >
            Exporter les impacts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectPageHeader;
