import { SurfaceAreaDistributionJson, UrbanSpaceCategory } from "shared";

import {
  getDescriptionForUrbanSpaceCategory,
  getLabelForSpaceCategory,
  getPictogramForUrbanSpaceCategory,
} from "@/features/create-project/domain/urbanProject";
import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type Props = {
  initialValues: SurfaceAreaDistributionJson<UrbanSpaceCategory>;
  totalSurfaceArea: number;
  spacesCategories: UrbanSpaceCategory[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = SurfaceAreaDistributionJson<UrbanSpaceCategory>;

function SpacesCategoriesSurfaceAreaDistributionForm({
  spacesCategories,
  initialValues,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  return (
    <SurfaceAreaDistributionForm
      initialValues={initialValues}
      title="Quelle superficie occuperont chacun des espaces ?"
      instructions={
        <FormInfo>
          La surface totale du site est de <strong>{formatSurfaceArea(totalSurfaceArea)}</strong>.
        </FormInfo>
      }
      onBack={onBack}
      onSubmit={onSubmit}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la superficie totale du site"
      surfaces={spacesCategories.map((spaceCategory) => ({
        name: spaceCategory,
        label: getLabelForSpaceCategory(spaceCategory),
        hintText: getDescriptionForUrbanSpaceCategory(spaceCategory),
        imgSrc: getPictogramForUrbanSpaceCategory(spaceCategory),
      }))}
    />
  );
}

export default SpacesCategoriesSurfaceAreaDistributionForm;
