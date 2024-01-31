import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import RequiredLabel from "@/shared/views/components/form/RequiredLabel/RequiredLabel";
import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/views/components/SurfaceArea/SurfaceArea";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  surfaceArea: number;
};

function SurfaceAreaForm({ onSubmit }: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>();

  const surface = watch("surfaceArea");

  return (
    <WizardFormLayout
      title="Quelle est la superficie totale du site ?"
      instructions={
        <>
          <p>Superficie à renseigner en m².</p>
          <p>Pour rappel : 1 ha = 10 000 m²</p>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="surfaceArea"
          label={<RequiredLabel label="Superficie totale" />}
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
        {!isNaN(surface) && (
          <p>
            Soit <strong>{convertSquareMetersToHectares(surface)}</strong> ha.
          </p>
        )}

        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default SurfaceAreaForm;
