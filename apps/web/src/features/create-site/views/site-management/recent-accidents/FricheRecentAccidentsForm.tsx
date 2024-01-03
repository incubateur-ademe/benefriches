import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
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

const requiredMessage = "Ce champ est requis";

function FricheRecentAccidentsForm({ onSubmit }: Props) {
  const { register, control, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const { hasRecentAccidents: hasRecentAccidentsError } = formState.errors;

  const options = [
    {
      label: "Non/NSP",
      value: "no",
    },
    {
      label: "Oui",
      value: "yes",
    },
  ];

  return (
    <WizardFormLayout
      title="Y a-t-il eu des accidents sur la friche ces 5 dernières années ?"
      instructions={
        <p>Personnes entrées illégalement sur la friche et s’étant blessées ou tuées.</p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("hasRecentAccidents", { required: requiredMessage })}
          options={options}
          error={hasRecentAccidentsError}
        />
        {watch("hasRecentAccidents") === "yes" && (
          <>
            <NumericInput
              name="minorInjuriesPersons"
              label="Nombre de blessés légers"
              control={control}
              rules={{
                min: {
                  value: 0,
                  message: "Veuillez sélectionner un montant valide",
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
                  message: "Veuillez sélectionner un montant valide",
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
                  message: "Veuillez sélectionner un montant valide",
                },
              }}
            />
          </>
        )}
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default FricheRecentAccidentsForm;
