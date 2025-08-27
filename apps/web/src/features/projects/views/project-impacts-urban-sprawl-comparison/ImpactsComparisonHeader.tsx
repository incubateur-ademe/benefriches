import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";

import { ProjectDevelopmentPlanType } from "@/features/projects/domain/projects.types";
import classNames, { ClassValue } from "@/shared/views/clsx";

import WithTooltip from "../my-projects-page/ScenariiList/ScenarioTile/ScenarioTileTooltip";
import { getScenarioPictoUrl } from "../shared/scenarioType";

export type HeaderProps = {
  projectName: string;
  baseSiteName: string;
  comparisonSiteName: string;
  projectType: ProjectDevelopmentPlanType;
  className?: ClassValue;
};

const ImpactsComparisonHeader = ({
  projectName,
  projectType,
  baseSiteName,
  comparisonSiteName,
  className,
}: HeaderProps) => {
  return (
    <div className={classNames(fr.cx("fr-container"), className)}>
      <div className={classNames("tw-flex", "tw-justify-between", "tw-items-center")}>
        <div>
          <h1 className="tw-text-sm tw-uppercase tw-font-normal tw-mb-1">
            Comparaison des impacts
          </h1>

          <h2
            className={classNames(
              fr.cx("fr-grid-row"),
              "tw-justify-start",
              "tw-items-end",
              "tw-text-2xl",
              "tw-mb-1",
            )}
          >
            <span className="tw-text-[#806922] dark:tw-text-[#F6F1E1]">
              <span
                className={fr.cx("fr-icon--sm", "fr-icon-map-pin-2-line", "fr-pr-1w")}
                aria-hidden="true"
              ></span>
              {baseSiteName}
            </span>
            <span className="tw-text-3xl tw-px-4">/</span>
            <span className="tw-text-[#7F236B] dark:tw-text-[#F6E1F1]">
              <span
                className={fr.cx("fr-icon--sm", "fr-icon-map-pin-2-line", "fr-pr-1w")}
                aria-hidden="true"
              ></span>
              {comparisonSiteName}
            </span>
          </h2>
          <div className="tw-flex tw-gap-2">
            <img
              className={classNames("tw-w-7 tw-h-7")}
              src={getScenarioPictoUrl(projectType)}
              aria-hidden={true}
              alt=""
              width="60"
              height="60"
            />
            <h3 className={classNames("tw-my-0", "tw-text-lg", "tw-font-normal")}>{projectName}</h3>
          </div>
        </div>

        <WithTooltip tooltipText="Bientôt disponible ⌛">
          <Button
            priority="primary"
            iconId="fr-icon-file-download-line"
            disabled
            onClick={() => {
              //exportImpactsModal.open();
            }}
          >
            Télécharger
          </Button>
        </WithTooltip>
      </div>
    </div>
  );
};

export default ImpactsComparisonHeader;
