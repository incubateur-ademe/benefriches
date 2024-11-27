import { BuildingsEconomicActivityUse } from "shared";

import { getPictogramUrlForEconomicActivityUses } from "@/features/create-project/domain/urbanProject";
import { getLabelForBuildingFloorArea } from "@/shared/domain/urbanProject";
import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

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
      instructions={
        <FormInfo>
          Votre projet comporte <strong>{formatSurfaceArea(totalSurfaceArea)}</strong> de futurs
          lieux d'activité économique.
        </FormInfo>
      }
      onBack={onBack}
      onSubmit={onSubmit as (data: Record<string, number>) => void}
      totalSurfaceArea={totalSurfaceArea}
      surfaces={soils.map((soil) => ({
        name: soil,
        label: getLabelForBuildingFloorArea(soil),
        imgSrc: getPictogramUrlForEconomicActivityUses(soil),
      }))}
    />
  );
}

export default EconomicActivitiesSurfaceAreaForm;
