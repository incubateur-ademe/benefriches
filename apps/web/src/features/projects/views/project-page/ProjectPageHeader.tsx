import { fr } from "@codegouvfr/react-dsfr";
import { ProjectDevelopmentPlanType } from "../../domain/projects.types";
import { getScenarioPictoUrl } from "../shared/scenarioType";
import ExpressProjectTooltipBadge from "./ExpressProjectBadge";

import classNames from "@/shared/views/clsx";

type Props = {
  projectName: string;
  siteName: string;
  projectType?: ProjectDevelopmentPlanType;
  isExpressProject: boolean;
  isSmall?: boolean;
};

const ProjectPageHeader = ({
  projectName,
  siteName,
  projectType,
  isExpressProject,
  isSmall = false,
}: Props) => {
  return (
    <div className={fr.cx("fr-container")}>
      <div
        className={classNames(
          fr.cx("fr-grid-row"),
          !isSmall && fr.cx("fr-my-2w"),
          "tw-justify-between",
          "tw-items-center",
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
            <div className="tw-inline-flex tw-items-center">
              <h2
                className={classNames(
                  fr.cx("fr-my-0"),
                  "tw-text-impacts-title",
                  isSmall && "tw-text-2xl",
                )}
              >
                {projectName}
              </h2>
              {isExpressProject && (
                <div>
                  <ExpressProjectTooltipBadge siteName={siteName} />
                </div>
              )}
            </div>
            <div className={classNames(!isSmall && fr.cx("fr-mt-1v"))}>
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
              <span className={classNames(fr.cx("fr-text--lg"), isSmall && "tw-text-lg tw-mb-0")}>
                {siteName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPageHeader;