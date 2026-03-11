import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type ManagerStructureType = "activity_park_manager" | "local_authority";

type FormValues = {
  structureType: ManagerStructureType | null;
};

type Props = {
  initialValues: {
    structureType: ManagerStructureType | undefined;
  };
  onSubmit: (data: { structureType: ManagerStructureType }) => void;
  onBack: () => void;
};

function ManagerForm({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: {
      structureType: initialValues.structureType ?? null,
    },
  });

  const structureTypeError = formState.errors.structureType;
  const structureTypeValue = watch("structureType");

  return (
    <WizardFormLayout title="Qui est le gestionnaire de la zone commerciale ?">
      <form
        onSubmit={handleSubmit(({ structureType }) => {
          if (structureType) {
            onSubmit({ structureType });
          }
        })}
      >
        <Fieldset
          state={structureTypeError ? "error" : "default"}
          stateRelatedMessage={structureTypeError ? structureTypeError.message : undefined}
        >
          <RadioButton
            label="Un gestionnaire de parc d'activité"
            value="activity_park_manager"
            {...register("structureType", {
              required: "Veuillez sélectionner un type de gestionnaire.",
            })}
          />
          <RadioButton
            label="La collectivité"
            value="local_authority"
            {...register("structureType")}
          />
        </Fieldset>

        <BackNextButtonsGroup
          onBack={onBack}
          disabled={!formState.isValid}
          nextLabel={structureTypeValue !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default ManagerForm;
