import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type HasRecentAccidentsStringOption = "yes" | "no";

export type FormValues = {
  hasRecentAccidents: HasRecentAccidentsStringOption;
  accidentsMinorInjuries?: number;
  accidentsSevereInjuries?: number;
  accidentsDeaths?: number;
};

function FricheRecentAccidentsForm({ onSubmit, onBack }: Props) {
  const { register, control, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const { hasRecentAccidents: hasRecentAccidentsError } = formState.errors;

  return (
    <WizardFormLayout
      title="Y a-t-il eu des accidents sur la friche ces 5 dernières années ?"
      instructions={
        <p>Personnes entrées illégalement sur la friche et s’étant blessées ou tuées.</p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset
          state={hasRecentAccidentsError ? "error" : "default"}
          stateRelatedMessage={
            hasRecentAccidentsError ? hasRecentAccidentsError.message : undefined
          }
        >
          <RadioButton label="Oui" value="yes" {...register("hasRecentAccidents")} />
          {watch("hasRecentAccidents") === "yes" && (
            <>
              <NumericInput
                name="accidentsMinorInjuries"
                label="Nombre de blessés légers"
                control={control}
                rules={{
                  min: {
                    value: 0,
                    message: "Veuillez entrer un nombre positif",
                  },
                }}
              />
              <NumericInput
                name="accidentsSevereInjuries"
                label="Nombre de blessés graves"
                control={control}
                rules={{
                  min: {
                    value: 0,
                    message: "Veuillez entrer un nombre positif",
                  },
                }}
              />
              <NumericInput
                name="accidentsDeaths"
                label="Nombre de décès"
                control={control}
                rules={{
                  min: {
                    value: 0,
                    message: "Veuillez entrer un nombre positif",
                  },
                }}
              />
            </>
          )}
          <RadioButton label="Non / NSP" value="no" {...register("hasRecentAccidents")} />
        </Fieldset>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default FricheRecentAccidentsForm;
