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
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import SliderNumericInput from "@/shared/views/components/form/NumericInput/SliderNumericInput";
import FormWarning from "@/shared/views/layout/WizardFormLayout/FormWarning";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  soils: SoilType[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
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

function SiteSoilsDistributionByPercentageForm({ soils, onSubmit, onBack }: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const soilsValues = watch();

  const totalAllocated = useMemo(() => getTotalAllocated(soilsValues), [soilsValues]);

  const remainder = 100 - totalAllocated;

  return (
    <WizardFormLayout
      title="Quelle est la répartition des différents sols ?"
      instructions={
        <FormWarning>
          <p>
            Le total des surfaces doit être égal à <strong>100%</strong>.
          </p>
        </FormWarning>
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
            hintInputText="%"
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
              ? "Le compte est bon !"
              : `${formatNumberFr(Math.abs(remainder))}% ${remainder > 0 ? "manquants" : "en trop"}`
          }
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteSoilsDistributionByPercentageForm;
