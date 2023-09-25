import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  surface: number;
};

function NaturalAreaSurfaceForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const error = formState.errors.surface;

  return (
    <>
      <h2>Quelle est la superficie totale de cet espace naturel ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Superficie"
          hintText="en m2"
          state={error ? "error" : "default"}
          stateRelatedMessage={error ? error.message : undefined}
          nativeInputProps={{
            type: "number",
            ...register("surface", {
              required: "Ce champ est requis",
              min: 0,
              valueAsNumber: true,
            }),
            placeholder: "250 000",
          }}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default NaturalAreaSurfaceForm;
