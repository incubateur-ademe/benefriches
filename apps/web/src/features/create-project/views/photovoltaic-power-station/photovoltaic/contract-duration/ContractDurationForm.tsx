import { useForm } from "react-hook-form";

import { AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS } from "@/features/create-project/domain/photovoltaic";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RowNumericInput from "@/shared/views/components/form/NumericInput/RowNumericInput";
import { requiredNumericFieldRegisterOptions } from "@/shared/views/components/form/NumericInput/registerOptions";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  photovoltaicContractDuration: number;
};

function PhotovoltaicAnnualProductionForm({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      photovoltaicContractDuration: AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS,
    },
  });

  return (
    <WizardFormLayout
      title="Quelle sera la durée prévisionnelle du contrat de la revente d'énergie au distributeur ?"
      instructions={
        <FormInfo>
          <p>La durée moyenne des contrats de rachat d'électricité photovoltaïque est de 20 ans.</p>
          <p>Vous pouvez modifier cette durée.</p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RowNumericInput
          nativeInputProps={register("photovoltaicContractDuration", {
            ...requiredNumericFieldRegisterOptions,
            min: 2,
          })}
          label="Durée du contrat de revente"
          addonText="années"
        />
        <BackNextButtonsGroup onBack={onBack} nextLabel="Valider" disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default PhotovoltaicAnnualProductionForm;
