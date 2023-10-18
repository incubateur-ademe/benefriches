import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";

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

  const _options = [
    {
      label: "Non/NSP",
      nativeInputProps: {
        value: "no",
        ...register("hasRecentAccidents", { required: requiredMessage }),
      },
    },
    {
      label: "Oui",
      nativeInputProps: {
        value: "yes",
        ...register("hasRecentAccidents", { required: requiredMessage }),
      },
    },
  ];

  return (
    <>
      <h2>Y a-t-il eu des accidents sur la friche ces 5 dernières années ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          options={_options}
          state={hasRecentAccidentsError ? "error" : "default"}
          stateRelatedMessage={
            hasRecentAccidentsError
              ? hasRecentAccidentsError.message
              : undefined
          }
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
