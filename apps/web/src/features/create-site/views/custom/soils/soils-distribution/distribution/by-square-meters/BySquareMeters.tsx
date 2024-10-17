import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { SoilType } from "shared";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import SurfaceAreaControlInput from "@/shared/views/components/form/SurfaceAreaControlInput/SurfaceAreaControlInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  totalSurfaceArea: number;
  soils: SoilType[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<SoilType, number>;

function SiteSoilsDistributionBySquareMetersForm({
  soils,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const soilsValues = watch();

  const totalAllocatedSurface = useMemo(() => sumObjectValues(soilsValues), [soilsValues]);

  const remainder = totalSurfaceArea - totalAllocatedSurface;
  const isValid = remainder === 0;

  return (
    <WizardFormLayout
      title="Quelles sont les superficies des différents sols ?"
      instructions={
        <SurfaceAreaPieChart soilsDistribution={soilsValues} remainderSurfaceArea={remainder} />
      }
    >
      <form onSubmit={_onSubmit}>
        {soils.map((soilType) => (
          <Controller
            key={soilType}
            control={control}
            name={soilType}
            rules={{
              min: {
                value: 0,
                message: "Veuillez sélectionner une superficie valide",
              },
              max: {
                value: totalSurfaceArea,
                message:
                  "La surface de ce sol ne peut pas être supérieure à la surface totale du site",
              },
            }}
            render={(controller) => {
              return (
                <ControlledRowNumericInput
                  {...controller}
                  label={getLabelForSoilType(soilType)}
                  hintText={getDescriptionForSoilType(soilType)}
                  addonText={SQUARE_METERS_HTML_SYMBOL}
                  imgSrc={`/img/pictograms/soil-types/${getPictogramForSoilType(soilType)}`}
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

export default SiteSoilsDistributionBySquareMetersForm;
