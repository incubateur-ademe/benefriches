import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  surfaceArea: number;
};

function SurfaceAreaForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const error = formState.errors.surfaceArea;

  return (
    <>
      <h2>Quelle est la superficie totale du site ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Superficie totale"
          hintText="en m2"
          state={error ? "error" : "default"}
          stateRelatedMessage={error ? error.message : undefined}
          nativeInputProps={{
            type: "number",
            ...register("surfaceArea", {
              min: 0,
              valueAsNumber: true,
              required:
                "Ce champ est nécessaire pour déterminer les questions suivantes",
            }),
          }}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default SurfaceAreaForm;
