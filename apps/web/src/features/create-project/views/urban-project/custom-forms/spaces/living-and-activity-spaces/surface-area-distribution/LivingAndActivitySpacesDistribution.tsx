import {
  livingAndActivitySpace,
  SurfaceAreaDistributionJson,
  UrbanLivingAndActivitySpace,
} from "shared";

import {
  getColorForUrbanLivingAndActivitySpace,
  getLabelForLivingAndActivitySpace,
  getPictogramUrlForUrbanLivingAndActivitySpace,
} from "@/features/create-project/core/urban-project/urbanProject";
import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type Props = {
  initialValues: SurfaceAreaDistributionJson<UrbanLivingAndActivitySpace>;
  totalSurfaceArea: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = SurfaceAreaDistributionJson<UrbanLivingAndActivitySpace>;

function LivingAndActivitySpacesDistribution({
  initialValues,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  return (
    <SurfaceAreaDistributionForm
      initialValues={initialValues}
      title="Quelle est la part de chaque espace à aménager dans les lieux de vie et d'activité ?"
      instructions={
        <FormInfo>
          Votre projet comporte <strong>{formatSurfaceArea(totalSurfaceArea)}</strong> de futurs
          lieux de vie et d'activité.
        </FormInfo>
      }
      onBack={onBack}
      onSubmit={onSubmit}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La superficie ne peut pas être supérieure à la superficie totale des espaces de vie et d'activité"
      surfaces={livingAndActivitySpace.options.map((space) => ({
        name: space,
        label: getLabelForLivingAndActivitySpace(space),
        imgSrc: getPictogramUrlForUrbanLivingAndActivitySpace(space),
        color: getColorForUrbanLivingAndActivitySpace(space),
      }))}
    />
  );
}

export default LivingAndActivitySpacesDistribution;
