import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

import ExpectedAnnualProductionHint from "./ExpectedAnnualProductionHint";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  expectedPerformanceMwhPerYear?: number;
};

type FormValues = {
  photovoltaicExpectedAnnualProduction: number;
};

function PhotovoltaicAnnualProductionForm({
  onSubmit,
  onBack,
  expectedPerformanceMwhPerYear,
}: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      photovoltaicExpectedAnnualProduction: expectedPerformanceMwhPerYear,
    },
  });

  return (
    <WizardFormLayout
      title="Quelle est la production annuelle attendue de l'installation ?"
      instructions={
        <FormInfo>
          <ExpectedAnnualProductionHint
            expectedPerformanceMwhPerYear={expectedPerformanceMwhPerYear}
          />
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowNumericInput
          nativeInputProps={register(
            "photovoltaicExpectedAnnualProduction",
            requiredNumericFieldRegisterOptions,
          )}
          label="Production attendue de l'installation"
          addonText="MWh/an"
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default PhotovoltaicAnnualProductionForm;
