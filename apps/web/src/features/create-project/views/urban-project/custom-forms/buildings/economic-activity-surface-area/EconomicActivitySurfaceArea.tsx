import {
  BuildingsEconomicActivityUse,
  ECONOMIC_ACTIVITY_BUILDINGS_USE,
  SurfaceAreaDistributionJson,
} from "shared";

import {
  getDescriptionForBuildingFloorArea,
  getPictogramUrlForEconomicActivityUses,
} from "@/features/create-project/domain/urbanProject";
import { getLabelForBuildingFloorArea } from "@/shared/domain/urbanProject";
import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type Props = {
  totalSurfaceArea: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = SurfaceAreaDistributionJson<BuildingsEconomicActivityUse>;

function EconomicActivitiesSurfaceAreaForm({ totalSurfaceArea, onSubmit, onBack }: Props) {
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
      onSubmit={onSubmit}
      totalSurfaceArea={totalSurfaceArea}
      surfaces={ECONOMIC_ACTIVITY_BUILDINGS_USE.map((use) => ({
        name: use,
        label: getLabelForBuildingFloorArea(use),
        hintText: getDescriptionForBuildingFloorArea(use),
        imgSrc: getPictogramUrlForEconomicActivityUses(use),
      }))}
    />
  );
}

export default EconomicActivitiesSurfaceAreaForm;
