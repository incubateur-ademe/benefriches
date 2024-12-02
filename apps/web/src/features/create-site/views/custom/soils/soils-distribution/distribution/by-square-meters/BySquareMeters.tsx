import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { SoilType } from "shared";
import { sumObjectValues } from "shared";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import RowDecimalsNumericInput from "@/shared/views/components/form/NumericInput/RowDecimalsNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import SurfaceAreaControlInput from "@/shared/views/components/form/SurfaceAreaControlInput/SurfaceAreaControlInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: Partial<FormValues>;
  totalSurfaceArea: number;
  soils: SoilType[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<SoilType, number>;

function SiteSoilsDistributionBySquareMetersForm({
  initialValues,
  soils,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });
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
          <RowDecimalsNumericInput
            key={soilType}
            hintText={getDescriptionForSoilType(soilType)}
            addonText={SQUARE_METERS_HTML_SYMBOL}
            label={getLabelForSoilType(soilType)}
            imgSrc={getPictogramForSoilType(soilType)}
            nativeInputProps={register(soilType, {
              ...optionalNumericFieldRegisterOptions,
              max: {
                value: totalSurfaceArea,
                message:
                  "La surface de ce sol ne peut pas être supérieure à la surface totale du site",
              },
            })}
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
