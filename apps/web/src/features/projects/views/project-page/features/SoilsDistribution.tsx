import { createSoilSurfaceAreaDistribution, typedObjectEntries } from "shared";

import {
  ProjectDevelopmentPlanType,
  ProjectFeatures,
} from "@/features/projects/domain/projects.types";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import classNames from "@/shared/views/clsx";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import SoilTypeLabelWithColorSquare from "@/shared/views/components/FeaturesList/FeaturesListSoilTypeLabel";

type Props = {
  soilsDistribution: ProjectFeatures["soilsDistribution"];
  isExpressProject: boolean;
  projectType: ProjectDevelopmentPlanType;
};

export default function SoilsDistribution({
  projectType,
  soilsDistribution,
  isExpressProject,
}: Props) {
  return (
    <>
      <DataLine
        noBorder
        label={<strong>Superficie totale</strong>}
        value={
          <strong>
            {formatSurfaceArea(
              createSoilSurfaceAreaDistribution(soilsDistribution).getTotalSurfaceArea(),
            )}
          </strong>
        }
      />
      <div className="tw-grid tw-grid-cols-12">
        <div
          className={classNames(
            "tw-col-span-12",
            "md:tw-col-span-3",
            "tw-border-0",
            "tw-border-solid",
            "tw-border-l-black",
            "tw-border-l",
          )}
        >
          <SurfaceAreaPieChart
            soilsDistribution={soilsDistribution}
            customHeight="200px"
            mode="plain"
          />
        </div>

        <div
          className={classNames(
            "tw-col-span-12",
            "md:tw-col-span-9",
            "tw-border-0",
            "tw-border-solid",
            "tw-border-l-black",
            "tw-border-l",
            "md:tw-border-0",
            "tw-pl-2",
            "md:tw-pl-0",
          )}
        >
          {typedObjectEntries(soilsDistribution).map(([soilType, surfaceArea]) => {
            return (
              <DataLine
                noBorder
                label={<SoilTypeLabelWithColorSquare soilType={soilType} />}
                value={formatSurfaceArea(surfaceArea ?? 0)}
                key={soilType}
                className="md:tw-grid-cols-[5fr_4fr]"
                valueTooltip={
                  isExpressProject && projectType === "URBAN_PROJECT"
                    ? "Répartition représentative de l’aménagement des espaces pour ce type de projet urbain. L’occupation des sols conditionne la capacité d’infiltration des eaux, la capacité de stockage de carbone dans les sols, etc."
                    : undefined
                }
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
