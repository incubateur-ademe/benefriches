import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/views/components/SurfaceArea/SurfaceArea";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  surfaceArea: number;
};

function SurfaceAreaForm({ onSubmit }: Props) {
  const { control, handleSubmit } = useForm<FormValues>();

  return (
    <WizardFormLayout title="Quelle est la superficie totale du site ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="surfaceArea"
          label="Superficie totale"
          hintText={`en ${SQUARE_METERS_HTML_SYMBOL}`}
          rules={{
            required: "Ce champ est requis",
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
          control={control}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default SurfaceAreaForm;
