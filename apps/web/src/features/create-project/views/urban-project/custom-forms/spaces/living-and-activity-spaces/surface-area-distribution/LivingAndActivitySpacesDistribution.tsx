import { UrbanLivingAndActivitySpace } from "shared";

import {
  getColorForUrbanLivingAndActivitySpace,
  getLabelForLivingAndActivitySpace,
  getPictogramUrlForUrbanLivingAndActivitySpace,
} from "@/features/create-project/domain/urbanProject";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";

type Props = {
  totalSurfaceArea: number;
  livingAndActivitySpaces: UrbanLivingAndActivitySpace[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<UrbanLivingAndActivitySpace, number>;

function LivingAndActivitySpacesDistribution({
  livingAndActivitySpaces,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  return (
    <SurfaceAreaDistributionForm
      title="Quelle est la part de chaque espace à aménager dans les lieux de vie et d'activité ?"
      onBack={onBack}
      onSubmit={onSubmit as (data: Record<string, number>) => void}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la superficie totale des espaces de vie et d'activité"
      soils={livingAndActivitySpaces.map((space) => ({
        name: space,
        label: getLabelForLivingAndActivitySpace(space),
        imgSrc: getPictogramUrlForUrbanLivingAndActivitySpace(space),
        color: getColorForUrbanLivingAndActivitySpace(space),
      }))}
    />
  );
}

export default LivingAndActivitySpacesDistribution;
