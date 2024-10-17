import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { UrbanGreenSpace } from "shared";

import { getLabelForUrbanGreenSpace } from "@/features/create-project/domain/urbanProject";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";
import { sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import SurfaceAreaControlInput from "@/shared/views/components/form/SurfaceAreaControlInput/SurfaceAreaControlInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  totalSurfaceArea: number;
  greenSpaces: UrbanGreenSpace[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<UrbanGreenSpace, number>;

function UrbanGreenSpacesDistribution({ greenSpaces, totalSurfaceArea, onSubmit, onBack }: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const surfaceAreas = watch();

  const totalAllocatedSurface = useMemo(() => sumObjectValues(surfaceAreas), [surfaceAreas]);

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
                  controlProps={controller}
                  label={getLabelForUrbanGreenSpace(spaceCategory)}
                  addonText={SQUARE_METERS_HTML_SYMBOL}
                  imgSrc={undefined}
                />
              );
            }}
          />
        ))}

        <SurfaceAreaControlInput
          label="Total de tous les espaces verts"
          currentSurfaceArea={totalAllocatedSurface}
          targetSurfaceArea={totalSurfaceArea}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default UrbanGreenSpacesDistribution;
