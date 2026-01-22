import type { SoilType, SurfaceAreaDistributionJson } from "shared";

import {
  getDescriptionForSpace,
  getLabelForSpace,
} from "@/features/create-project/core/urban-project/urbanProject";
import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { getPictogramForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type SpaceConstraint = {
  soilType: SoilType;
  maxSurfaceArea: number;
};

type Props = {
  initialValues: SurfaceAreaDistributionJson<SoilType>;
  totalSurfaceArea: number;
  selectedSpaces: SoilType[];
  spacesWithConstraints: SpaceConstraint[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = SurfaceAreaDistributionJson<SoilType>;

const getHintTextForSoil = (
  soilType: SoilType,
  spacesWithConstraints: SpaceConstraint[],
): string | undefined => {
  const constraint = spacesWithConstraints.find((c) => c.soilType === soilType);
  if (constraint) {
    return `Maximum : ${formatSurfaceArea(constraint.maxSurfaceArea)}`;
  }

  return getDescriptionForSpace(soilType);
};

function SpacesSurfaceAreaForm({
  selectedSpaces,
  initialValues,
  totalSurfaceArea,
  spacesWithConstraints,
  onSubmit,
  onBack,
}: Props) {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();

  return (
    <SurfaceAreaDistributionForm
      initialValues={initialValues}
      title="Quelle sera la superficie de chaque type d'espace&nbsp;?"
      instructions={
        <FormInfo>
          <p>
            La surface totale du site est de <strong>{formatSurfaceArea(totalSurfaceArea)}</strong>.
          </p>
          <p>
            Pour les espaces naturels ou agricoles, la surface ne peut pas dépasser celle existant
            actuellement sur le site.
          </p>
        </FormInfo>
      }
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
      onBack={onBack}
      onSubmit={onSubmit}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La surface ne peut excéder la superficie totale du site ou celle d'un espace naturel existant."
      surfaces={selectedSpaces.map((soilType) => ({
        name: soilType,
        label: getLabelForSpace(soilType),
        hintText: getHintTextForSoil(soilType, spacesWithConstraints),
        imgSrc: getPictogramForSoilType(soilType),
        maxSurfaceArea: spacesWithConstraints.find((c) => c.soilType === soilType)?.maxSurfaceArea,
      }))}
    />
  );
}

export default SpacesSurfaceAreaForm;
