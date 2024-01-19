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
import SurfaceArea, {
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/views/components/SurfaceArea/SurfaceArea";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  totalSurfaceArea: number;
  soils: SoilType[];
  onSubmit: (data: FormValues) => void;
};

export type FormValues = Record<SoilType, number>;

const getTotalSurface = (soilsDistribution: FormValues) =>
  Object.values(soilsDistribution)
    .filter(Number)
    .reduce((total, surface) => total + surface, 0);

const getInitialSurfacesFormSoilTypes = (soils: SoilType[]) =>
  soils.reduce((soilsDistribution, soilType) => ({ ...soilsDistribution, [soilType]: 0 }), {});

const SLIDER_PROPS = {
  tooltip: {
    formatter: (value?: number) => value && `${formatNumberFr(value)} m²`,
  },
};

function SiteSoilsDistributionForm({ soils, totalSurfaceArea, onSubmit }: Props) {
  const defaultValues = useMemo(() => getInitialSurfacesFormSoilTypes(soils), [soils]);
  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues,
  });
  const _onSubmit = handleSubmit(onSubmit);

  const soilsValues = watch();

  const totalAllocatedSurface = useMemo(() => getTotalSurface(soilsValues), [soilsValues]);

  const remainder = totalSurfaceArea - totalAllocatedSurface;

  return (
    <WizardFormLayout
      title="Quelles sont les superficies des différents sols ?"
      instructions={
        <p>
          La somme des superficies des différents sols doit être égale à la superficie totale du
          site, soit{" "}
          <strong>
            <SurfaceArea surfaceAreaInSquareMeters={totalSurfaceArea} />
          </strong>
          .
        </p>
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
            sliderEndValue={totalSurfaceArea}
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
        <div className="fr-py-7v">
          <Button
            onClick={() => {
              reset(defaultValues);
            }}
            priority="secondary"
            nativeButtonProps={{ type: "button" }}
          >
            Réinitialiser les valeurs
          </Button>
        </div>

        <Input
          label="Total de toutes les superficies allouées"
          hintText={`en ${SQUARE_METERS_HTML_SYMBOL}`}
          nativeInputProps={{
            value: totalAllocatedSurface,
            max: totalSurfaceArea,
            type: "number",
          }}
          disabled
          state={remainder !== 0 ? "error" : "default"}
          stateRelatedMessage={`${remainder > 0 ? "-" : "+"} ${formatNumberFr(
            Math.abs(remainder),
          )} m²`}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default SiteSoilsDistributionForm;