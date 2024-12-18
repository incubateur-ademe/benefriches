import { urbanPublicSpace, UrbanPublicSpace } from "shared";

import {
  getColorForUrbanPublicSpace,
  getDescriptionForPublicSpace,
  getLabelForPublicSpace,
  getPictogramUrlForUrbanPublicSpace,
} from "@/features/create-project/domain/urbanProject";
import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type Props = {
  totalSurfaceArea: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<UrbanPublicSpace, number>;

function PublicSpacesDistribution({ totalSurfaceArea, onSubmit, onBack }: Props) {
  return (
    <SurfaceAreaDistributionForm
      title="Quelle est la part de chaque espace dans les espaces publics ?"
      instructions={
        <FormInfo>
          Votre projet comporte <strong>{formatSurfaceArea(totalSurfaceArea)}</strong> de futurs
          espaces publics.
        </FormInfo>
      }
      onBack={onBack}
      onSubmit={onSubmit as (data: Record<string, number>) => void}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la superficie totale des espaces publics"
      surfaces={urbanPublicSpace.options.map((space) => ({
        name: space,
        label: getLabelForPublicSpace(space),
        hintText: getDescriptionForPublicSpace(space),
        imgSrc: getPictogramUrlForUrbanPublicSpace(space),
        color: getColorForUrbanPublicSpace(space),
      }))}
    />
  );
}

export default PublicSpacesDistribution;
