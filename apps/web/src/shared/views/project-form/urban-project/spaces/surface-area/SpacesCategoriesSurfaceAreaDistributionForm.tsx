import { SurfaceAreaDistributionJson, UrbanSpaceCategory } from "shared";

import {
  getColorForUrbanSpaceCategory,
  getDescriptionForUrbanSpaceCategory,
  getLabelForSpaceCategory,
  getPictogramForUrbanSpaceCategory,
} from "@/features/create-project/core/urban-project/urbanProject";
import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type Props = {
  initialValues: SurfaceAreaDistributionJson<UrbanSpaceCategory>;
  totalSurfaceArea: number;
  spacesCategories: UrbanSpaceCategory[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = SurfaceAreaDistributionJson<UrbanSpaceCategory>;

function SpacesCategoriesSurfaceAreaDistributionForm({
  spacesCategories,
  initialValues,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();
  return (
    <SurfaceAreaDistributionForm
      initialValues={initialValues}
      title="Quelle superficie occuperont chacun des espaces ?"
      instructions={
        <FormInfo>
          La surface totale du site est de <strong>{formatSurfaceArea(totalSurfaceArea)}</strong>.
        </FormInfo>
      }
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
      onBack={onBack}
      onSubmit={onSubmit}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la superficie totale du site"
      surfaces={spacesCategories.map((spaceCategory) => ({
        name: spaceCategory,
        label: getLabelForSpaceCategory(spaceCategory),
        hintText: getDescriptionForUrbanSpaceCategory(spaceCategory),
        imgSrc: getPictogramForUrbanSpaceCategory(spaceCategory),
        color: getColorForUrbanSpaceCategory(spaceCategory),
      }))}
    />
  );
}

export default SpacesCategoriesSurfaceAreaDistributionForm;
