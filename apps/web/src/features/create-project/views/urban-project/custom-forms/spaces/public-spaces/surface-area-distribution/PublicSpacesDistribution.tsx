import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { UrbanPublicSpace } from "shared";

import { getLabelForPublicSpace } from "@/features/create-project/domain/urbanProject";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";
import { sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import SurfaceAreaControlInput from "@/shared/views/components/form/SurfaceAreaControlInput/SurfaceAreaControlInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  totalSurfaceArea: number;
  publicSpaces: UrbanPublicSpace[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<UrbanPublicSpace, number>;

function PublicSpacesDistribution({ publicSpaces, totalSurfaceArea, onSubmit, onBack }: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const surfaceAreas = watch();

  const totalAllocatedSurface = useMemo(() => sumObjectValues(surfaceAreas), [surfaceAreas]);

  const remainder = totalSurfaceArea - totalAllocatedSurface;
  const isValid = remainder === 0;

  return (
    <WizardFormLayout title="Quelle est la part de chaque espace dans les espaces publics ?">
      <form onSubmit={_onSubmit}>
        {publicSpaces.map((publicSpace) => (
          <Controller
            name={publicSpace}
            control={control}
            key={publicSpace}
            rules={{
              min: {
                value: 0,
                message: "Veuillez sélectionner une superficie",
              },
              max: {
                value: totalSurfaceArea,
                message:
                  "La superficie ne peut pas être supérieure à la superficie totale des espaces publics",
              },
            }}
            render={(controller) => {
              return (
                <ControlledRowNumericInput
                  {...controller}
                  label={getLabelForPublicSpace(publicSpace)}
                  addonText={SQUARE_METERS_HTML_SYMBOL}
                  imgSrc={undefined}
                />
              );
            }}
          />
        ))}
        <SurfaceAreaControlInput
          label="Total de tous les espaces publics"
          currentSurfaceArea={totalAllocatedSurface}
          targetSurfaceArea={totalSurfaceArea}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default PublicSpacesDistribution;
