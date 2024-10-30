import { UrbanPublicSpace } from "shared";

import {
  getColorForUrbanPublicSpace,
  getLabelForPublicSpace,
  getPictogramUrlForUrbanPublicSpace,
} from "@/features/create-project/domain/urbanProject";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";

type Props = {
  totalSurfaceArea: number;
  publicSpaces: UrbanPublicSpace[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<UrbanPublicSpace, number>;

function PublicSpacesDistribution({ publicSpaces, totalSurfaceArea, onSubmit, onBack }: Props) {
  return (
    <SurfaceAreaDistributionForm
      title="Quelle est la part de chaque espace dans les espaces publics ?"
      onBack={onBack}
      onSubmit={onSubmit as (data: Record<string, number>) => void}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la superficie totale des espaces publics"
      soils={publicSpaces.map((space) => ({
        name: space,
        label: getLabelForPublicSpace(space),
        imgSrc: getPictogramUrlForUrbanPublicSpace(space),
        color: getColorForUrbanPublicSpace(space),
      }))}
    />
  );
}

export default PublicSpacesDistribution;
