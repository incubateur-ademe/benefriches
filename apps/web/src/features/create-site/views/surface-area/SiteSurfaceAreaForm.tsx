import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  surfaceArea: number;
};

function SurfaceAreaForm({ onSubmit }: Props) {
  const { control, handleSubmit } = useForm<FormValues>();

  return (
    <>
      <h2>Quelle est la superficie totale du site ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="surfaceArea"
          label="Superficie totale"
          hintText="en m2"
          rules={{ required: "Ce champ est requis" }}
          control={control}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default SurfaceAreaForm;
