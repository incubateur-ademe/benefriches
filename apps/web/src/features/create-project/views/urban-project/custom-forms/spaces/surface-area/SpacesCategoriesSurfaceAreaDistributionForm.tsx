import { UrbanSpaceCategory } from "shared";

import {
  getDescriptionForUrbanSpaceCategory,
  getLabelForSpaceCategory,
  getPictogramForUrbanSpaceCategory,
} from "@/features/create-project/domain/urbanProject";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";

type Props = {
  totalSurfaceArea: number;
  spacesCategories: UrbanSpaceCategory[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<UrbanSpaceCategory, number>;

function SpacesCategoriesSurfaceAreaDistributionForm({
  spacesCategories,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  return (
    <SurfaceAreaDistributionForm
      title="Quelle superficie occuperont chacun des espaces ?"
      onBack={onBack}
      onSubmit={onSubmit as (data: Record<string, number>) => void}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la superficie totale du site"
      soils={spacesCategories.map((spaceCategory) => ({
        name: spaceCategory,
        label: getLabelForSpaceCategory(spaceCategory),
        hintText: getDescriptionForUrbanSpaceCategory(spaceCategory),
        imgSrc: getPictogramForUrbanSpaceCategory(spaceCategory),
      }))}
    />
  );
}

export default SpacesCategoriesSurfaceAreaDistributionForm;
