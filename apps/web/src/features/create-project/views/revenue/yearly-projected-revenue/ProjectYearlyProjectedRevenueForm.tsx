import { useForm } from "react-hook-form";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  operationsAmount?: number;
  otherAmount?: number;
};

const ProjectYearlyProjectedRevenueForm = ({ onSubmit, onBack }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>();

  const allCosts = watch();

  return (
    <WizardFormLayout title="Recettes annuelles prévisionnelles">
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          label="Recettes d'exploitation"
          hintText="€ / an"
          name="operationsAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />
        <NumericInput
          control={control}
          label="Autres recettes"
          hintText="€ / an"
          name="otherAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />
        <p>
          <strong>
            Total des recettes annuelles : {formatNumberFr(sumObjectValues(allCosts))} €
          </strong>
        </p>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
};

export default ProjectYearlyProjectedRevenueForm;
