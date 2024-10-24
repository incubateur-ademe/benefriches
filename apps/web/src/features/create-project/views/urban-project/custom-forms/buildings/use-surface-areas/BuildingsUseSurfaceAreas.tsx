import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { sumObjectValues } from "shared";

import {
  BuildingsUseCategory,
  getLabelForBuildingsUseCategory,
} from "@/features/create-project/domain/urbanProject";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import SurfaceAreaControlInput from "@/shared/views/components/form/SurfaceAreaControlInput/SurfaceAreaControlInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  totalSurfaceArea: number;
  selectedBuildingsUseCategories: BuildingsUseCategory[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<BuildingsUseCategory, number>;

function BuildingsUseCategorySurfaceAreas({
  selectedBuildingsUseCategories,
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
    <WizardFormLayout title="Quelles seront les surfaces de plancher des usages ?">
      <form onSubmit={_onSubmit}>
        {selectedBuildingsUseCategories.map((useCategory) => (
          <Controller
            name={useCategory}
            control={control}
            key={useCategory}
            rules={{
              min: {
                value: 0,
                message: "Veuillez entrer une superficie valide",
              },
              max: {
                value: totalSurfaceArea,
                message:
                  "La superficie ne peut pas être supérieure à la surface de plancher des bâtiments",
              },
            }}
            render={(controller) => {
              return (
                <ControlledRowNumericInput
                  controlProps={controller}
                  label={getLabelForBuildingsUseCategory(useCategory)}
                  addonText={SQUARE_METERS_HTML_SYMBOL}
                  imgSrc={undefined}
                />
              );
            }}
          />
        ))}

        <SurfaceAreaControlInput
          label="Total de toutes les surfaces"
          currentSurfaceArea={totalAllocatedSurface}
          targetSurfaceArea={totalSurfaceArea}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default BuildingsUseCategorySurfaceAreas;
