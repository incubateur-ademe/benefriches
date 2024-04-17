import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@codegouvfr/react-dsfr/Input";

import { getColorForSoilType, SoilType } from "@/shared/domain/soils";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SliderNumericInput from "@/shared/views/components/form/NumericInput/SliderNumericInput";
import SurfaceArea from "@/shared/views/components/SurfaceArea/SurfaceArea";
import FormWarning from "@/shared/views/layout/WizardFormLayout/FormWarning";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  soils: SoilType[];
  totalSurfaceArea: number;
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

function SiteSoilsDistributionByPercentageForm({
  soils,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
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
            Le total des surfaces ne peut pas dépasser{" "}
            <strong>
              <SurfaceArea surfaceAreaInSquareMeters={totalSurfaceArea} />
            </strong>
            . Pour pouvoir augmenter la surface d’un sol, vous devez d’abord réduire la surface d’un
            autre sol.
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
              ? "Les pourcentages alloués sont égaux à 100%"
              : `${remainder > 0 ? "-" : "+"} ${formatNumberFr(Math.abs(remainder))} %`
          }
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteSoilsDistributionByPercentageForm;
