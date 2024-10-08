import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  decontaminationSelection: "all" | "partial" | "none" | "unknown" | null;
};

function SoilsDecontaminationSelection({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>();

  return (
    <WizardFormLayout title="Les sols pollués seront-ils dépollués ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("decontaminationSelection")}
          options={[
            {
              label: "Oui, totalement dépollués",
              value: "all",
            },
            {
              label: "Oui, partiellement dépollués",
              value: "partial",
            },
            {
              label: "Non",
              value: "none",
            },
            {
              label: "Ne sait pas",
              value: "unknown",
            },
          ]}
          error={formState.errors.decontaminationSelection}
        />
        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={watch("decontaminationSelection") !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default SoilsDecontaminationSelection;
