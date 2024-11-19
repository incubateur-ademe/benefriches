import { BuildingsEconomicActivityUse } from "shared";

import { getPictogramUrlForEconomicActivityUses } from "@/features/create-project/domain/urbanProject";
import { getLabelForBuildingFloorArea } from "@/shared/domain/urbanProject";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";

type Props = {
  totalSurfaceArea: number;
  soils: BuildingsEconomicActivityUse[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<BuildingsEconomicActivityUse, number>;

function EconomicActivitiesSurfaceAreaForm({ soils, totalSurfaceArea, onSubmit, onBack }: Props) {
  return (
    <SurfaceAreaDistributionForm
      title="Quelles seront les surfaces de plancher de chaque lieu d’activité économique ?"
      onBack={onBack}
      onSubmit={onSubmit as (data: Record<string, number>) => void}
      totalSurfaceArea={totalSurfaceArea}
      soils={soils.map((soil) => ({
        name: soil,
        label: getLabelForBuildingFloorArea(soil),
        imgSrc: getPictogramUrlForEconomicActivityUses(soil),
      }))}
    />
  );
}

export default EconomicActivitiesSurfaceAreaForm;
