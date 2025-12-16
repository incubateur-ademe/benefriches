import { BuildingsUse, SurfaceAreaDistributionJson } from "shared";

import {
  getDescriptionForBuildingsUse,
  getPictogramUrlForBuildingsUse,
} from "@/features/create-project/core/urban-project/urbanProject";
import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { getColorForBuildingsUse, getLabelForBuildingsUse } from "@/shared/core/urbanProject";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type Props = {
  initialValues?: FormValues;
  options: BuildingsUse[];
  totalSurfaceArea: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = SurfaceAreaDistributionJson<BuildingsUse>;

function BuildingsUseSurfaceAreas({
  initialValues,
  totalSurfaceArea,
  onSubmit,
  onBack,
  options,
}: Props) {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();

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
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
      onBack={onBack}
      onSubmit={onSubmit}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la surface de plancher des bâtiments"
      surfaces={options.map((use) => ({
        name: use,
        label: getLabelForBuildingsUse(use),
        hintText: getDescriptionForBuildingsUse(use),
        imgSrc: getPictogramUrlForBuildingsUse(use),
        color: getColorForBuildingsUse(use),
      }))}
    />
  );
}

export default BuildingsUseSurfaceAreas;
