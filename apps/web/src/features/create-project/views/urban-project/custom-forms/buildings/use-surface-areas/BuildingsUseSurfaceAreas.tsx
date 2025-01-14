import { SurfaceAreaDistributionJson } from "shared";

import {
  BUILDINGS_USE_CATEGORIES,
  BuildingsUseCategory,
  getDescriptionForBuildingsUseCategory,
  getLabelForBuildingsUseCategory,
  getPictogramUrlForBuildingsUseCategory,
} from "@/features/create-project/core/urban-project/urbanProject";
import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type Props = {
  initialValues?: FormValues;
  totalSurfaceArea: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = SurfaceAreaDistributionJson<BuildingsUseCategory>;

function BuildingsUseCategorySurfaceAreas({
  initialValues,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
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
      surfaces={BUILDINGS_USE_CATEGORIES.map((useCategory) => ({
        name: useCategory,
        label: getLabelForBuildingsUseCategory(useCategory),
        hintText: getDescriptionForBuildingsUseCategory(useCategory),
        imgSrc: getPictogramUrlForBuildingsUseCategory(useCategory),
      }))}
    />
  );
}

export default BuildingsUseCategorySurfaceAreas;
