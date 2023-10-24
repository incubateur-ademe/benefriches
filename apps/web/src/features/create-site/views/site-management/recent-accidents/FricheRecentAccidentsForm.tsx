import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";

import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type HasRecentAccidentsStringOption = "yes" | "no";

export type FormValues = {
  hasRecentAccidents: HasRecentAccidentsStringOption;
  minorInjuriesPersons: number;
  severeInjuriesPersons: number;
  deaths: number;
};

const requiredMessage = "Ce champ est requis";

function FricheRecentAccidentsForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const {
    hasRecentAccidents: hasRecentAccidentsError,
    minorInjuriesPersons: minorInjuriesPersonsError,
    severeInjuriesPersons: severeInjuriesPersonsError,
    deaths: deathsError,
  } = formState.errors;

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
    <>
      <h2>Y a-t-il eu des accidents sur la friche ces 5 dernières années ?</h2>
      <p>
        Personnes entrées illégalement sur la friche et s’étant blessées ou
        tuées.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("hasRecentAccidents", { required: requiredMessage })}
          options={options}
          error={hasRecentAccidentsError}
        />
        {watch("hasRecentAccidents") === "yes" && (
          <>
            <Input
              label="Nombre de blessés légers"
              state={minorInjuriesPersonsError ? "error" : "default"}
              stateRelatedMessage={
                minorInjuriesPersonsError
                  ? minorInjuriesPersonsError.message
                  : undefined
              }
              nativeInputProps={{
                ...register("minorInjuriesPersons", {
                  required: requiredMessage,
                }),
              }}
            />
            <Input
              label="Nombre de blessés graves"
              state={severeInjuriesPersonsError ? "error" : "default"}
              stateRelatedMessage={
                severeInjuriesPersonsError
                  ? severeInjuriesPersonsError.message
                  : undefined
              }
              nativeInputProps={{
                ...register("severeInjuriesPersons", {
                  required: requiredMessage,
                }),
              }}
            />
            <Input
              label="Nombre de morts"
              state={deathsError ? "error" : "default"}
              stateRelatedMessage={
                deathsError ? deathsError.message : undefined
              }
              nativeInputProps={{
                ...register("deaths", {
                  required: requiredMessage,
                }),
              }}
            />
          </>
        )}
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default FricheRecentAccidentsForm;
