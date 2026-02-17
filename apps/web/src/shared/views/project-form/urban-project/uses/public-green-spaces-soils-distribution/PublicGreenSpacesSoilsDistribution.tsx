import type { SoilType, SurfaceAreaDistributionJson } from "shared";

import {
  getDescriptionForSpace,
  getLabelForSpace,
} from "@/features/create-project/core/urban-project/urbanProject";
import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { getPictogramForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import { getColorForSoilType } from "@/shared/core/soils";
import SurfaceAreaDistributionForm from "@/shared/views/components/form/SurfaceAreaDistributionForm/SurfaceAreaDistributionForm";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

type SpaceConstraint = {
  soilType: SoilType;
  maxSurfaceArea: number;
};

type Props = {
  initialValues: SurfaceAreaDistributionJson<SoilType>;
  totalSurfaceArea: number;
  availableSoilTypes: SoilType[];
  existingNaturalSoilsConstraints: SpaceConstraint[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = SurfaceAreaDistributionJson<SoilType>;

const getHintTextForSoil = (
  soilType: SoilType,
  existingNaturalSoilsConstraints: SpaceConstraint[],
): string | undefined => {
  const constraint = existingNaturalSoilsConstraints.find((c) => c.soilType === soilType);
  if (constraint) {
    return `Maximum : ${formatSurfaceArea(constraint.maxSurfaceArea)}`;
  }

  return getDescriptionForSpace(soilType);
};

function PublicGreenSpacesSoilsDistribution({
  availableSoilTypes,
  initialValues,
  totalSurfaceArea,
  existingNaturalSoilsConstraints,
  onSubmit,
  onBack,
}: Props) {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();

  return (
    <SurfaceAreaDistributionForm
      initialValues={initialValues}
      title={
        <>
          Quels types de sols et espaces y aura-t-il au sein des{" "}
          <strong>espaces verts publics</strong>&nbsp;?
        </>
      }
      instructions={
        <FormInfo>
          <p>
            La surface totale des espaces verts publics est de{" "}
            <strong>{formatSurfaceArea(totalSurfaceArea)}</strong>.
          </p>
          <p>
            Pour les espaces naturels, la surface ne peut pas dépasser celle existant actuellement
            sur le site.
          </p>
        </FormInfo>
      }
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
      onBack={onBack}
      onSubmit={onSubmit}
      totalSurfaceArea={totalSurfaceArea}
      maxErrorMessage="La surface ne peut excéder la superficie totale des espaces verts publics ou celle d'un espace naturel existant."
      surfaces={availableSoilTypes.map((soilType) => ({
        name: soilType,
        label: getLabelForSpace(soilType),
        hintText: getHintTextForSoil(soilType, existingNaturalSoilsConstraints),
        imgSrc: getPictogramForSoilType(soilType),
        maxSurfaceArea: existingNaturalSoilsConstraints.find((c) => c.soilType === soilType)
          ?.maxSurfaceArea,
        color: getColorForSoilType(soilType),
      }))}
    />
  );
}

export default PublicGreenSpacesSoilsDistribution;
