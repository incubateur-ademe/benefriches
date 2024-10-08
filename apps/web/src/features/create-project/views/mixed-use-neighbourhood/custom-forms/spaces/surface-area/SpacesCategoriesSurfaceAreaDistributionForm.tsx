import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { UrbanSpaceCategory } from "shared";

import {
  getDescriptionForUrbanSpaceCategory,
  getLabelForSpaceCategory,
  getPictogramForUrbanSpaceCategory,
} from "@/features/create-project/domain/urbanProject";
import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  totalSurfaceArea: number;
  spacesCategories: UrbanSpaceCategory[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<UrbanSpaceCategory, number>;

const getTotalSurface = (surfaceAreaDistribution: FormValues) =>
  Object.values(surfaceAreaDistribution)
    .filter(Number)
    .reduce((total, surface) => total + surface, 0);

function SpacesCategoriesSurfaceAreaDistributionForm({
  spacesCategories,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const soilsValues = watch();

  const totalAllocatedSurface = useMemo(() => getTotalSurface(soilsValues), [soilsValues]);

  const remainder = totalSurfaceArea - totalAllocatedSurface;
  const isValid = remainder === 0;

  return (
    <WizardFormLayout title="Quelle superficie occuperont chacun des espaces ?">
      <form onSubmit={_onSubmit}>
        {spacesCategories.map((spaceCategory) => (
          <Controller
            name={spaceCategory}
            control={control}
            key={spaceCategory}
            rules={{
              min: {
                value: 0,
                message: "Veuillez sélectionner une superficie",
              },
              max: {
                value: totalSurfaceArea,
                message: "La superficie ne peut pas être supérieure à la superficie totale du site",
              },
            }}
            render={(controller) => {
              return (
                <ControlledRowNumericInput
                  {...controller}
                  label={getLabelForSpaceCategory(spaceCategory)}
                  hintText={getDescriptionForUrbanSpaceCategory(spaceCategory)}
                  hintInputText="en m²"
                  imgSrc={getPictogramForUrbanSpaceCategory(spaceCategory)}
                />
              );
            }}
          />
        ))}

        <RowNumericInput
          className="tw-pb-5"
          label="Total de toutes les surfaces"
          hintText={`en ${SQUARE_METERS_HTML_SYMBOL}`}
          nativeInputProps={{
            value: totalAllocatedSurface,
            min: 0,
            max: totalSurfaceArea,
            type: "number",
          }}
          disabled
          state={isValid ? "success" : "error"}
          stateRelatedMessage={
            isValid
              ? "Le compte est bon !"
              : `${formatSurfaceArea(Math.abs(remainder))} ${remainder > 0 ? "manquants" : "en trop"}`
          }
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SpacesCategoriesSurfaceAreaDistributionForm;
