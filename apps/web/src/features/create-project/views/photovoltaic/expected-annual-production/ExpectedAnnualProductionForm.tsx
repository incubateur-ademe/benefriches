import { useForm } from "react-hook-form";
import ExpectedAnnualProductionComputationDetails from "./ExpectedAnnualProductionComputationDetails";
import ExpectedAnnualProductionHint from "./ExpectedAnnualProductionHint";

import { State } from "@/features/create-project/application/pvExpectedPerformanceStorage.reducer";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  surfaceArea?: number;
  computationContext?: State["computationContext"];
  expectedPerformanceMwhPerYear?: State["expectedPerformanceMwhPerYear"];
};

type FormValues = {
  photovoltaicExpectedAnnualProduction: number;
};

function PhotovoltaicAnnualProductionForm({
  onSubmit,
  onBack,
  expectedPerformanceMwhPerYear,
  computationContext,
  surfaceArea,
}: Props) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      photovoltaicExpectedAnnualProduction: expectedPerformanceMwhPerYear,
    },
  });

  return (
    <WizardFormLayout
      title="Quelle est la production annuelle attendue de votre installation ?"
      instructions={
        <>
          <ExpectedAnnualProductionHint
            expectedPerformanceMwhPerYear={expectedPerformanceMwhPerYear}
          />

          {computationContext && surfaceArea && (
            <ExpectedAnnualProductionComputationDetails
              computationContext={computationContext}
              surfaceArea={surfaceArea}
            />
          )}
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="photovoltaicExpectedAnnualProduction"
          label="Production attendue de l’installation"
          hintText="en MWh/an"
          rules={{
            min: 0,
            required: "Ce champ est nécessaire pour déterminer les questions suivantes",
          }}
          control={control}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default PhotovoltaicAnnualProductionForm;
