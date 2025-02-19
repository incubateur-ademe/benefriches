import { BUILDINGS_USE_LIST, BuildingsUse, SurfaceAreaDistributionJson } from "shared";

import {
  getDescriptionForBuildingsUse,
  getPictogramUrlForBuildingsUse,
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

type FormValues = SurfaceAreaDistributionJson<BuildingsUse>;

function BuildingsUseSurfaceAreas({ initialValues, totalSurfaceArea, onSubmit, onBack }: Props) {
  return (
    <SurfaceAreaDistributionForm
      initialValues={initialValues}
      title="Quelles seront les surfaces de plancher des usages ?"
      instructions={
        <FormInfo>
          Votre projet comporte <strong>{formatSurfaceArea(totalSurfaceArea)}</strong> de futurs
          bâtiments.
        </FormInfo>
      }
      onBack={onBack}
      onSubmit={onSubmit}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la surface de plancher des bâtiments"
      surfaces={BUILDINGS_USE_LIST.map((use) => ({
        name: use,
        label: getLabelForBuildingFloorArea(use),
        hintText: getDescriptionForBuildingsUse(use),
        imgSrc: getPictogramUrlForBuildingsUse(use),
      }))}
    />
  );
}

export default BuildingsUseSurfaceAreas;
