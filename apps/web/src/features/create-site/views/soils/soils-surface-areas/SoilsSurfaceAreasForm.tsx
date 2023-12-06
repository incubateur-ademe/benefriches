import { useMemo } from "react";
import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";

import { SoilType } from "@/shared/domain/soils";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import SliderNumericInput from "@/shared/views/components/form/NumericInput/SliderNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  totalSurfaceArea: number;
  soils: SoilType[];
  onSubmit: (data: FormValues) => void;
};

export type FormValues = Record<SoilType, number>;

const getTotalSurface = (soilsSurfaceAreas: FormValues) =>
  Object.values(soilsSurfaceAreas)
    .filter(Number)
    .reduce((total, surface) => total + surface, 0);

const getInitialSurfacesFormSoilTypes = (soils: SoilType[]) =>
  soils.reduce(
    (soilSurfaceAreas, soilType) => ({ ...soilSurfaceAreas, [soilType]: 0 }),
    {},
  );

const SLIDER_PROPS = {
  tooltip: {
    formatter: (value?: number) => value && `${formatNumberFr(value)} m²`,
  },
};

function SiteSoilsSurfaceAreasForm({
  soils,
  totalSurfaceArea,
  onSubmit,
}: Props) {
  const defaultValues = useMemo(
    () => getInitialSurfacesFormSoilTypes(soils),
    [soils],
  );
  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues,
  });
  const _onSubmit = handleSubmit(onSubmit);

  const soilsValues = watch();

  const totalAllocatedSurface = useMemo(
    () => getTotalSurface(soilsValues),
    [soilsValues],
  );

  const freeSurface = totalSurfaceArea - totalAllocatedSurface;

  return (
    <WizardFormLayout
      title="Quelles sont les superficies des différents sols ?"
      instructions={
        <p>
          La somme des superficies des différents sols doit être égale à la
          superficie totale du site, soit{" "}
          <strong>{formatNumberFr(totalSurfaceArea)} m2</strong>.
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
            hintText="en m2"
            sliderStartValue={0}
            sliderEndValue={totalSurfaceArea}
            maxValue={freeSurface + soilsValues[soilType]}
            sliderProps={SLIDER_PROPS}
          />
        ))}
        <div className="fr-py-7v">
          <Button
            onClick={() => reset(defaultValues)}
            priority="secondary"
            nativeButtonProps={{ type: "button" }}
          >
            Réinitialiser les valeurs
          </Button>
        </div>

        <Input
          label="Total de toutes les superficies allouées"
          hintText="en m2"
          nativeInputProps={{
            value: totalAllocatedSurface,
            max: totalSurfaceArea,
            type: "number",
          }}
          disabled
          state={totalAllocatedSurface < totalSurfaceArea ? "error" : "default"}
          stateRelatedMessage={`- ${formatNumberFr(
            totalSurfaceArea - totalAllocatedSurface,
          )} m²`}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default SiteSoilsSurfaceAreasForm;
