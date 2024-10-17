import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { SoilType } from "shared";

import { getColorForSoilType } from "@/shared/domain/soils";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import SliderNumericInput from "@/shared/views/components/form/NumericInput/SliderNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  soils: SoilType[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<SoilType, number>;

const SLIDER_PROPS = {
  tooltip: {
    formatter: (value?: number) => value && `${formatNumberFr(value)} %`,
  },
};

function SiteSoilsDistributionByPercentageForm({ soils, onSubmit, onBack }: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const soilsValues = watch();

  const totalAllocated = useMemo(() => sumObjectValues(soilsValues), [soilsValues]);

  const remainder = 100 - totalAllocated;

  return (
    <WizardFormLayout
      title="Quelle est la répartition des différents sols ?"
      instructions={
        <SurfaceAreaPieChart soilsDistribution={soilsValues} remainderSurfaceArea={remainder} />
      }
    >
      <form onSubmit={_onSubmit}>
        {soils.map((soilType) => (
          <SliderNumericInput
            key={soilType}
            control={control}
            name={soilType}
            label={getLabelForSoilType(soilType)}
            imgSrc={`/img/pictograms/soil-types/${getPictogramForSoilType(soilType)}`}
            hintText={getDescriptionForSoilType(soilType)}
            addonText="%"
            sliderStartValue={0}
            sliderEndValue={100}
            sliderProps={{
              styles: {
                track: {
                  background: getColorForSoilType(soilType),
                },
              },
              ...SLIDER_PROPS,
            }}
          />
        ))}

        <RowNumericInput
          className="fr-my-8v"
          label="Total de toutes les surfaces"
          addonText="%"
          nativeInputProps={{
            value: totalAllocated,
            min: 0,
            max: 100,
            type: "number",
          }}
          disabled
          state={remainder === 0 ? "success" : "error"}
          stateRelatedMessage={
            remainder === 0
              ? "Le compte est bon !"
              : `${formatNumberFr(Math.abs(remainder))}% ${remainder > 0 ? "manquants" : "en trop"}`
          }
        />
        <BackNextButtonsGroup onBack={onBack} disabled={remainder !== 0} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default SiteSoilsDistributionByPercentageForm;
