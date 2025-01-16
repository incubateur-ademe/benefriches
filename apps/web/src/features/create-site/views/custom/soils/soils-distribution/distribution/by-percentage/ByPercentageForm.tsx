import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { SoilType } from "shared";
import { sumObjectValues } from "shared";

import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import {
  getDescriptionForSoilType,
  getLabelForSoilType,
  getPictogramForSoilType,
} from "@/shared/core/label-mapping/soilTypeLabelMapping";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import SurfaceAreaPieChart from "@/shared/views/components/Charts/SurfaceAreaPieChart";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import { optionalNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: Partial<FormValues>;
  soils: SoilType[];
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = Record<SoilType, number>;

function SiteSoilsDistributionByPercentageForm({ initialValues, soils, onSubmit, onBack }: Props) {
  const { register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });
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
          <RowNumericInput
            key={soilType}
            hintText={getDescriptionForSoilType(soilType)}
            addonText="%"
            label={getLabelForSoilType(soilType)}
            imgSrc={getPictogramForSoilType(soilType)}
            className="!tw-pt-4"
            nativeInputProps={register(soilType, optionalNumericFieldRegisterOptions)}
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
