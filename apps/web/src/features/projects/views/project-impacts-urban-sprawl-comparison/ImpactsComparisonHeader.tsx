import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode, useId } from "react";

import { ProjectDevelopmentPlanType } from "@/features/projects/domain/projects.types";
import classNames, { ClassValue } from "@/shared/views/clsx";

import { getScenarioPictoUrl } from "../shared/scenarioType";

type HeaderProps = {
  projectName: string;
  baseSiteName: string;
  comparisonSiteName: string;
  projectType: ProjectDevelopmentPlanType;
  className?: ClassValue;
};

const WithTooltip = ({ children, tooltipText }: { children: ReactNode; tooltipText: string }) => {
  const id = useId();

  if (!tooltipText) return children;

  const tooltipId = `tooltip-scenario-tile-${id}`;
  return (
    <>
      <div aria-describedby={tooltipId}>{children}</div>
      <span className="fr-tooltip fr-placement" id={tooltipId} role="tooltip" aria-hidden="true">
        {tooltipText}
      </span>
    </>
  );
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
      <div className={classNames("flex", "justify-between", "items-center")}>
        <div>
          <h1 className="text-sm uppercase font-normal mb-1">Comparaison des impacts</h1>

          <h2
            className={classNames(
              fr.cx("fr-grid-row"),
              "justify-start",
              "items-end",
              "text-2xl",
              "mb-1",
            )}
          >
            <span className="text-[#806922] dark:text-[#F6F1E1]">
              <span
                className={fr.cx("fr-icon--sm", "fr-icon-map-pin-2-line", "fr-pr-1w")}
                aria-hidden="true"
              ></span>
              {baseSiteName}
            </span>
            <span className="text-3xl px-4">/</span>
            <span className="text-[#7F236B] dark:text-[#F6E1F1]">
              <span
                className={fr.cx("fr-icon--sm", "fr-icon-map-pin-2-line", "fr-pr-1w")}
                aria-hidden="true"
              ></span>
              {comparisonSiteName}
            </span>
          </h2>
          <div className="flex gap-2">
            <img
              className={classNames("w-7 h-7")}
              src={getScenarioPictoUrl(projectType)}
              aria-hidden={true}
              alt=""
              width="60"
              height="60"
            />
            <h3 className={classNames("my-0", "text-lg", "font-normal")}>{projectName}</h3>
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
