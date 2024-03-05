import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  currentOwnerName?: string;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  hasRealEstateTransaction: "yes" | "no";
};

function HasRealEstateTransactionForm({ onSubmit, onBack, currentOwnerName }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { hasRealEstateTransaction: "no" },
  });

  return (
    <WizardFormLayout
      title={`Le site sera-t-il racheté ${currentOwnerName ? `à ${currentOwnerName}` : "au propriétaire"} ?`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("hasRealEstateTransaction")}
          options={[
            {
              label: "Oui",
              value: "yes",
            },
            {
              label: "Non",
              value: "no",
            },
          ]}
          error={formState.errors.hasRealEstateTransaction}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default HasRealEstateTransactionForm;
