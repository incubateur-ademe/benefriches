import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
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
  const { control, handleSubmit, formState } = useForm<FormValues>({
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
        <NumericInput
          name="photovoltaicExpectedAnnualProduction"
          label="Production attendue de l'installation"
          addonText="MWh/an"
          rules={{
            min: 0,
            required: "Ce champ est nécessaire pour déterminer les questions suivantes",
          }}
          control={control}
          allowDecimals={false}
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default PhotovoltaicAnnualProductionForm;
