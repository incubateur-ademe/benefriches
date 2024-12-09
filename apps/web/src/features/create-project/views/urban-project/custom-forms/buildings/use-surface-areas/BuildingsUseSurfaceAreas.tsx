import {
  BuildingsUseCategory,
  getLabelForBuildingsUseCategory,
  getPictogramUrlForBuildingsUseCategory,
} from "@/features/create-project/domain/urbanProject";
import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type Props = {
  totalSurfaceArea: number;
  selectedBuildingsUseCategories: BuildingsUseCategory[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = Record<BuildingsUseCategory, number>;

function BuildingsUseCategorySurfaceAreas({
  selectedBuildingsUseCategories,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  return (
    <SurfaceAreaDistributionForm
      title="Quelles seront les surfaces de plancher des usages ?"
      instructions={
        <FormInfo>
          Votre projet comporte <strong>{formatSurfaceArea(totalSurfaceArea)}</strong> de futurs
          bâtiments.
        </FormInfo>
      }
      onBack={onBack}
      onSubmit={onSubmit as (data: Record<string, number>) => void}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la surface de plancher des bâtiments"
      surfaces={selectedBuildingsUseCategories.map((useCategory) => ({
        name: useCategory,
        label: getLabelForBuildingsUseCategory(useCategory),
        imgSrc: getPictogramUrlForBuildingsUseCategory(useCategory),
      }))}
    />
  );
}

export default BuildingsUseCategorySurfaceAreas;
