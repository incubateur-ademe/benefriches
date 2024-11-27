import { UrbanGreenSpace } from "shared";

import {
  getColorForUrbanGreenSpace,
  getLabelForUrbanGreenSpace,
  getPictogramUrlForUrbanGreenSpace,
} from "@/features/create-project/domain/urbanProject";
import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type Props = {
  totalSurfaceArea: number;
  greenSpaces: UrbanGreenSpace[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<UrbanGreenSpace, number>;

function UrbanGreenSpacesDistribution({ greenSpaces, totalSurfaceArea, onSubmit, onBack }: Props) {
  return (
    <SurfaceAreaDistributionForm
      title="Quelle est la part de chaque espace à aménager sur les espaces verts ?"
      instructions={
        <FormInfo>
          Votre projet comporte <strong>{formatSurfaceArea(totalSurfaceArea)}</strong> de futurs
          espaces verts.
        </FormInfo>
      }
      onBack={onBack}
      onSubmit={onSubmit as (data: Record<string, number>) => void}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la superficie totale des espaces verts"
      surfaces={greenSpaces.map((space) => ({
        name: space,
        label: getLabelForUrbanGreenSpace(space),
        imgSrc: getPictogramUrlForUrbanGreenSpace(space),
        color: getColorForUrbanGreenSpace(space),
      }))}
    />
  );
}

export default UrbanGreenSpacesDistribution;
