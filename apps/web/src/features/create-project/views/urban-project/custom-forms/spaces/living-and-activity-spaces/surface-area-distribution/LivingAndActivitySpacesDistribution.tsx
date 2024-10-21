import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { UrbanLivingAndActivitySpace } from "shared";
import { sumObjectValues } from "shared";

import {
  getLabelForLivingAndActivitySpace,
  getPictogramUrlForUrbanLivingAndActivitySpace,
} from "@/features/create-project/domain/urbanProject";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import SurfaceAreaControlInput from "@/shared/views/components/form/SurfaceAreaControlInput/SurfaceAreaControlInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  totalSurfaceArea: number;
  livingAndActivitySpaces: UrbanLivingAndActivitySpace[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<UrbanLivingAndActivitySpace, number>;

function LivingAndActivitySpacesDistribution({
  livingAndActivitySpaces,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const surfaceAreas = watch();

  const totalAllocatedSurface = useMemo(() => sumObjectValues(surfaceAreas), [surfaceAreas]);

  const remainder = totalSurfaceArea - totalAllocatedSurface;
  const isValid = remainder === 0;

  return (
    <WizardFormLayout title="Quelle est la part de chaque espace à aménager dans les lieux de vie et d'activité ?">
      <form onSubmit={_onSubmit}>
        {livingAndActivitySpaces.map((space) => (
          <Controller
            name={space}
            control={control}
            key={space}
            rules={{
              min: {
                value: 0,
                message: "Veuillez sélectionner une superficie",
              },
              max: {
                value: totalSurfaceArea,
                message:
                  "La superficie ne peut pas être supérieure à la superficie totale des espaces de vie et d'activité",
              },
            }}
            render={(controller) => {
              return (
                <ControlledRowNumericInput
                  controlProps={controller}
                  label={getLabelForLivingAndActivitySpace(space)}
                  addonText={SQUARE_METERS_HTML_SYMBOL}
                  imgSrc={getPictogramUrlForUrbanLivingAndActivitySpace(space)}
                />
              );
            }}
          />
        ))}
        <SurfaceAreaControlInput
          label="Total de tous les espaces de vie et d'activité"
          currentSurfaceArea={totalAllocatedSurface}
          targetSurfaceArea={totalSurfaceArea}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default LivingAndActivitySpacesDistribution;
