import { SurfaceAreaDistributionJson, urbanPublicSpace, UrbanPublicSpace } from "shared";

import {
  getColorForUrbanPublicSpace,
  getDescriptionForPublicSpace,
  getLabelForPublicSpace,
  getPictogramUrlForUrbanPublicSpace,
} from "@/features/create-project/core/urban-project/urbanProject";
import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type Props = {
  initialValues: SurfaceAreaDistributionJson<UrbanPublicSpace>;
  totalSurfaceArea: number;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = SurfaceAreaDistributionJson<UrbanPublicSpace>;

function PublicSpacesDistribution({ initialValues, totalSurfaceArea, onSubmit, onBack }: Props) {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();
  return (
    <SurfaceAreaDistributionForm
      initialValues={initialValues}
      title="Quels seront les revêtements des espaces publics ?"
      instructions={
        <FormInfo>
          Votre projet comporte <strong>{formatSurfaceArea(totalSurfaceArea)}</strong> de futurs
          espaces publics.
        </FormInfo>
      }
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
      onBack={onBack}
      onSubmit={onSubmit}
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
