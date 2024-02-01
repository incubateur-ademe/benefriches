import { useMemo } from "react";
import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";

import { getColorForSoilType, SoilType } from "@/shared/domain/soils";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import SliderNumericInput from "@/shared/views/components/form/NumericInput/SliderNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  soils: SoilType[];
  onSubmit: (data: FormValues) => void;
};

export type FormValues = Record<SoilType, number>;

const getTotalAllocated = (distribution: FormValues) =>
  Object.values(distribution)
    .filter(Number)
    .reduce((total, percent) => total + percent, 0);

const SLIDER_PROPS = {
  tooltip: {
    formatter: (value?: number) => value && `${formatNumberFr(value)} %`,
  },
};

function SiteSoilsDistributionByPercentageForm({ soils, onSubmit }: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const soilsValues = watch();

  const totalAllocated = useMemo(() => getTotalAllocated(soilsValues), [soilsValues]);

  const remainder = 100 - totalAllocated;

  return (
    <WizardFormLayout title="Quelle est la répartition des différents sols ?">
      <form onSubmit={_onSubmit}>
        {soils.map((soilType) => (
          <SliderNumericInput
            key={soilType}
            control={control}
            name={soilType}
            label={getLabelForSoilType(soilType)}
            hintText={getDescriptionForSoilType(soilType)}
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

        <Input
          className="fr-my-8v"
          label="Total de toutes les surfaces"
          hintText={`en %`}
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
              ? "Les pourcentages alloués sont égals à 100%"
              : `${remainder > 0 ? "-" : "+"} ${formatNumberFr(Math.abs(remainder))} %`
          }
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default SiteSoilsDistributionByPercentageForm;
