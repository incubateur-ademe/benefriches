import {
  BuildingsEconomicActivityUse,
  ECONOMIC_ACTIVITY_BUILDINGS_USE,
  SurfaceAreaDistributionJson,
} from "shared";

import {
  getDescriptionForBuildingFloorArea,
  getPictogramUrlForEconomicActivityUses,
} from "@/features/create-project/core/urban-project/urbanProject";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { getLabelForBuildingFloorArea } from "@/shared/core/urbanProject";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type Props = {
  initialValues?: FormValues;
  totalSurfaceArea: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = SurfaceAreaDistributionJson<BuildingsEconomicActivityUse>;

function EconomicActivitiesSurfaceAreaForm({
  initialValues,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  return (
    <SurfaceAreaDistributionForm
      initialValues={initialValues}
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
