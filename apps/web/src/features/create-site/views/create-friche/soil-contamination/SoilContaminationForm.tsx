import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";

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

  const error = formState.errors.hasContaminatedSoils;

  const _options = [
    {
      label: "Oui",
      nativeInputProps: {
        value: "yes",
        ...register("hasContaminatedSoils", { required: requiredMessage }),
      },
    },
    {
      label: "Non/NSP",
      nativeInputProps: {
        value: "no",
        ...register("hasContaminatedSoils", { required: requiredMessage }),
      },
    },
  ];

  return (
    <>
      <h2>Les sols de la friche sont-ils pollués ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          options={_options}
          state={error ? "error" : "default"}
          stateRelatedMessage={error ? error.message : undefined}
        />
        {watch("hasContaminatedSoils") === "yes" && (
          <Input
            label="Superficie polluée"
            hintText="en m2"
            nativeInputProps={{
              type: "number",
              ...register("contaminatedSurface", {
                min: 0,
                valueAsNumber: true,
                required: true,
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
