import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  isFricheLeased: "yes" | "no" | null;
};

function IsFricheLeasedForm({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>();

  return (
    <WizardFormLayout title="La friche est-elle encore louée ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("isFricheLeased")}
          options={[
            {
              label: `Oui`,
              value: "yes",
            },
            {
              label: "Non / Ne sait pas",
              value: "no",
            },
          ]}
          error={formState.errors.isFricheLeased}
        />
        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={watch("isFricheLeased") !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default IsFricheLeasedForm;
