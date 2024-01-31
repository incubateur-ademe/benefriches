import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import Fieldset from "@/shared/views/components/form/Fieldset/Fieldset";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RadioButton from "@/shared/views/components/form/RadioButton/RadioButton";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type HasRecentAccidentsStringOption = "yes" | "no";

export type FormValues = {
  hasRecentAccidents: HasRecentAccidentsStringOption;
  minorInjuriesPersons?: number;
  severeInjuriesPersons?: number;
  deaths?: number;
};

function FricheRecentAccidentsForm({ onSubmit }: Props) {
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
                name="minorInjuriesPersons"
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
                name="severeInjuriesPersons"
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
                name="deaths"
                label="Nombre de morts"
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
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default FricheRecentAccidentsForm;
