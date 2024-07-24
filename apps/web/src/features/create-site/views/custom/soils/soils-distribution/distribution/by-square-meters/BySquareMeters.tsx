import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { SoilType } from "shared";

import {
  formatSurfaceArea,
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/services/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import FormWarning from "@/shared/views/layout/WizardFormLayout/FormWarning";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  totalSurfaceArea: number;
  soils: SoilType[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<SoilType, number>;

const getTotalSurface = (soilsDistribution: FormValues) =>
  Object.values(soilsDistribution)
    .filter(Number)
    .reduce((total, surface) => total + surface, 0);

function SiteSoilsDistributionBySquareMetersForm({
  soils,
  totalSurfaceArea,
  onSubmit,
  onBack,
}: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();
  const _onSubmit = handleSubmit(onSubmit);

  const soilsValues = watch();

  const totalAllocatedSurface = useMemo(() => getTotalSurface(soilsValues), [soilsValues]);

  const remainder = totalSurfaceArea - totalAllocatedSurface;
  const isValid = remainder === 0;

  return (
    <WizardFormLayout
      title="Quelles sont les superficies des différents sols ?"
      instructions={
        <FormWarning>
          <p>
            La somme des superficies des différents sols doit être égale à la superficie totale du
            site (<strong>{formatSurfaceArea(totalSurfaceArea)}</strong>
            ).
          </p>
        </FormWarning>
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
                message: "Veuillez sélectionner un montant valide",
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
                  hintInputText="en m²"
                  imgSrc={`/img/pictograms/soil-types/${getPictogramForSoilType(soilType)}`}
                />
              );
            }}
          />
        ))}

        <RowNumericInput
          className="tw-pb-5"
          label="Total de toutes les surfaces"
          hintText={`en ${SQUARE_METERS_HTML_SYMBOL}`}
          nativeInputProps={{
            value: totalAllocatedSurface,
            min: 0,
            max: totalSurfaceArea,
            type: "number",
          }}
          disabled
          state={isValid ? "success" : "error"}
          stateRelatedMessage={
            isValid
              ? "Le compte est bon !"
              : `${formatSurfaceArea(Math.abs(remainder))} ${remainder > 0 ? "manquants" : "en trop"}`
          }
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteSoilsDistributionBySquareMetersForm;
