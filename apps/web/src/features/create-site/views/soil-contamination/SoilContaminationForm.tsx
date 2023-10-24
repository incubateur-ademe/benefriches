import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";

import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type HasContaminatedSoilsString = "yes" | "no";

type FormValues = {
  hasContaminatedSoils: HasContaminatedSoilsString;
  contaminatedSurface: number;
};

const requiredMessage =
  "Ce champ est nécessaire pour déterminer les questions suivantes";

function SoilContaminationForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: { contaminatedSurface: 0 },
    shouldUnregister: true,
  });

  const hasContaminatedSoilsError = formState.errors.hasContaminatedSoils;
  const contaminatedSurfaceError = formState.errors.contaminatedSurface;

  const options = [
    {
      label: "Oui",
      value: "yes",
    },
    {
      label: "Non/NSP",
      value: "no",
    },
  ];

  return (
    <>
      <h2>Les sols de la friche sont-ils pollués ?</h2>
      <p>
        Les polluants principaux des friches pouvant représenter un risque
        sanitaire : métaux lourds, hydrocarbures, composants organiques
        volatils, pesticides, nitrites, nitrates, cyanures, polychlorobiphényle.
        La pollution à l’amiante n’est pas à renseigner, mais un poste de
        dépense “désamiantage” pourra être alloué dans la partie “création d’un
        projet sur la friche”.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("hasContaminatedSoils", { required: requiredMessage })}
          options={options}
          error={hasContaminatedSoilsError}
        />
        {watch("hasContaminatedSoils") === "yes" && (
          <Input
            label="Superficie polluée"
            hintText="en m2"
            state={contaminatedSurfaceError ? "error" : "default"}
            stateRelatedMessage={
              contaminatedSurfaceError
                ? contaminatedSurfaceError.message
                : undefined
            }
            nativeInputProps={{
              type: "number",
              ...register("contaminatedSurface", {
                min: 0,
                valueAsNumber: true,
                required: requiredMessage,
              }),
            }}
          />
        )}
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default SoilContaminationForm;
