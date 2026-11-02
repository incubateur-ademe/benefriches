import { useForm } from "react-hook-form";
import { MAX_EVALUATION_PERIOD_IN_YEARS } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  photovoltaicContractDuration: number;
};

function PhotovoltaicAnnualProductionForm({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  // Non-blocking: impacts are computed over at most MAX_EVALUATION_PERIOD_IN_YEARS.
  const isLongerThanMaxEvaluationPeriod =
    watch("photovoltaicContractDuration") > MAX_EVALUATION_PERIOD_IN_YEARS;

  return (
    <WizardFormLayout title="Quelle sera la durée prévisionnelle du contrat de la revente d'énergie au distributeur&nbsp;?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowNumericInput
          nativeInputProps={register("photovoltaicContractDuration", {
            ...requiredNumericFieldRegisterOptions,
            min: 2,
          })}
          label="Durée du contrat de revente"
          addonText="années"
          state={isLongerThanMaxEvaluationPeriod ? "warning" : "default"}
          stateRelatedMessage={
            isLongerThanMaxEvaluationPeriod
              ? `Cette durée est inhabituelle. Vérifiez la valeur saisie : les impacts du projet seront calculés sur ${MAX_EVALUATION_PERIOD_IN_YEARS} ans au maximum.`
              : undefined
          }
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default PhotovoltaicAnnualProductionForm;
