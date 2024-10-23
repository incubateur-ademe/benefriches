import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { SoilType } from "shared";
import { sumObjectValues } from "shared";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/services/label-mapping/soilTypeLabelMapping";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  soils: SoilType[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<SoilType, number>;

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
          <Controller
            key={soilType}
            control={control}
            name={soilType}
            rules={{
              min: {
                value: 0,
                message: "Veuillez entrer un montant valide",
              },
            }}
            render={(controller) => {
              return (
                <ControlledRowNumericInput
                  controlProps={controller}
                  label={getLabelForSoilType(soilType)}
                  imgSrc={getPictogramForSoilType(soilType)}
                  addonText="%"
                  hintText={getDescriptionForSoilType(soilType)}
                />
              );
            }}
          />
        ))}

        <RowNumericInput
          className="tw-my-10 tw-pt-0"
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
