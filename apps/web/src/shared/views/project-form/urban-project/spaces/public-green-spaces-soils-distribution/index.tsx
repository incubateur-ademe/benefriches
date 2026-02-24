import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { getSurfaceAreaDistributionWithUnit } from "@/shared/core/reducers/project-form/urban-project/helpers/surfaceAreaDistribution";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import PublicGreenSpacesSoilsDistribution from "./PublicGreenSpacesSoilsDistribution";

export default function PublicGreenSpacesSoilsDistributionContainer() {
  const { onBack, onRequestStepCompletion, selectPublicGreenSpacesSoilsDistributionViewData } =
    useProjectForm();

  const {
    publicGreenSpacesSoilsDistribution,
    availableSoilTypes,
    totalSurfaceArea,
    existingNaturalSoilsConstraints,
  } = useAppSelector(selectPublicGreenSpacesSoilsDistributionViewData);

  const { inputMode } = useSurfaceAreaInputMode();

  const initialValues =
    publicGreenSpacesSoilsDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(
          publicGreenSpacesSoilsDistribution,
          "percentage",
          totalSurfaceArea,
        ).value
      : (publicGreenSpacesSoilsDistribution ?? {});

  return (
    <PublicGreenSpacesSoilsDistribution
      initialValues={initialValues}
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
          answers: { publicGreenSpacesSoilsDistribution: formData },
        });
      }}
      onBack={onBack}
      totalSurfaceArea={totalSurfaceArea}
      availableSoilTypes={availableSoilTypes}
      existingNaturalSoilsConstraints={existingNaturalSoilsConstraints}
    />
  );
}
