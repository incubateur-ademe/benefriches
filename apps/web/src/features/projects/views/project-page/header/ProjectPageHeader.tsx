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
          "flex flex-col gap-2",
          "md:grid md:grid-cols-[72px_1fr_240px] md:gap-x-3",
        )}
      >
        {projectType && (
          <img
            className={classNames(
              "col-start-1",
              "sm:row-start-1",
              "sm:row-span-2",
              isSmallSize ? "w-[60px] h-[60px]" : "md:w-[72px] md:h-[72px]",
            )}
            src={getScenarioPictoUrl(projectType)}
            aria-hidden={true}
            alt=""
            width="60"
            height="60"
          />
        )}

        <div className="col-start-2 sm:inline-flex items-center">
          <h2 className={classNames("my-0", isSmallSize && "text-2xl")}>{projectName}</h2>
          {isExpressProject && !isSmallScreen && <ExpressProjectTooltipBadge />}
        </div>
        <div
          className={classNames(
            "row-start-2",
            "col-start-1 sm:col-start-2",
            "col-span-3 sm:col-span-1",
          )}
        >
          <span
            className={
              fr.cx(
                "fr-icon-map-pin-2-line",
                "fr-icon--sm",
                isSmallSize ? "fr-mr-1w" : "fr-mr-0-5v",
              ),
            }
            aria-hidden="true"
          ></span>
          <a
            href={siteFeaturesHref}
            className="text-base hover:underline"
            style={{ backgroundImage: "none" }} // DSFR applies a background image for underline style by default
          >
            {siteName}
          </a>
        </div>
        <div className="md:col-start-3 md:row-span-3 flex items-center md:justify-end">
          <Button
            priority="primary"
            iconId="fr-icon-file-download-line"
            size={size}
            onClick={() => {
              exportImpactsModal.open();
            }}
          >
            Télécharger les impacts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectPageHeader;
