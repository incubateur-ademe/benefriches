import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@codegouvfr/react-dsfr/Input";

import { SoilType } from "@/shared/domain/soils";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import SurfaceArea, {
  SQUARE_METERS_HTML_SYMBOL,
} from "@/shared/views/components/SurfaceArea/SurfaceArea";
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

  return (
    <WizardFormLayout
      title="Quelles sont les superficies des différents sols ?"
      instructions={
        <FormWarning>
          <p>
            La somme des superficies des différents sols doit être égale à la superficie totale du
            site (
            <strong>
              <SurfaceArea surfaceAreaInSquareMeters={totalSurfaceArea} />
            </strong>
            ).
          </p>
        </FormWarning>
      }
    >
      <form onSubmit={_onSubmit}>
        {soils.map((soilType) => (
          <NumericInput
            key={soilType}
            control={control}
            label={getLabelForSoilType(soilType)}
            hintText={getDescriptionForSoilType(soilType)}
            placeholder={"en m²"}
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
          />
        ))}

        <Input
          label="Total de toutes les surfaces"
          hintText={`en ${SQUARE_METERS_HTML_SYMBOL}`}
          nativeInputProps={{
            value: totalAllocatedSurface,
            min: 0,
            max: totalSurfaceArea,
            type: "number",
          }}
          disabled
          state={remainder === 0 ? "success" : "error"}
          stateRelatedMessage={
            remainder === 0
              ? "Les surfaces allouées sont égales à la surface totale du site"
              : `${remainder > 0 ? "-" : "+"} ${formatNumberFr(Math.abs(remainder))} m²`
          }
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteSoilsDistributionBySquareMetersForm;
