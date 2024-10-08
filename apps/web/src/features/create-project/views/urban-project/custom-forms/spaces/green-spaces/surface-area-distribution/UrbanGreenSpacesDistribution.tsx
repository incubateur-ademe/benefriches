import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { UrbanGreenSpace } from "shared";

import { getLabelForUrbanGreenSpace } from "@/features/create-project/domain/urbanProject";
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
  greenSpaces: UrbanGreenSpace[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<UrbanGreenSpace, number>;

const getTotalSurface = (surfaceAreaDistribution: FormValues) =>
  Object.values(surfaceAreaDistribution)
    .filter(Number)
    .reduce((total, surface) => total + surface, 0);

function UrbanGreenSpacesDistribution({ greenSpaces, totalSurfaceArea, onSubmit, onBack }: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const surfaceAreas = watch();

  const totalAllocatedSurface = useMemo(() => getTotalSurface(surfaceAreas), [surfaceAreas]);

  const remainder = totalSurfaceArea - totalAllocatedSurface;
  const isValid = remainder === 0;

  return (
    <WizardFormLayout title="Quelle est la part de chaque espace à aménager sur les espaces verts ?">
      <form onSubmit={_onSubmit}>
        {greenSpaces.map((spaceCategory) => (
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
                message:
                  "La superficie ne peut pas être supérieure à la superficie totale des espaces verts",
              },
            }}
            render={(controller) => {
              return (
                <ControlledRowNumericInput
                  {...controller}
                  label={getLabelForUrbanGreenSpace(spaceCategory)}
                  hintInputText="en m²"
                  imgSrc={undefined}
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

export default UrbanGreenSpacesDistribution;