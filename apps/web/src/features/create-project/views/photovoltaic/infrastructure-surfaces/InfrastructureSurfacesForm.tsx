import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
  suggestedFoundationsSurface: number;
  suggestedAccessPathsSurface: number;
};

type FormValues = {
  photovoltaic: {
    accessPathsSurface: number;
    foundationsSurface: number;
  };
};

function PhotovoltaicInfrastructureSurfacesForm({
  suggestedFoundationsSurface,
  suggestedAccessPathsSurface,
  onSubmit,
}: Props) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      photovoltaic: {
        foundationsSurface: suggestedFoundationsSurface,
        accessPathsSurface: suggestedAccessPathsSurface,
      },
    },
  });

  return (
    <>
      <h2>Superficie des infrastructures</h2>
      <p>
        Les superficies recommandées pour les infrastructures sont calculées à
        partir des moyennes de puissance d’installations photovoltaïques en
        France.
      </p>

      <ul>
        <li>Fondations des panneaux : 0.02 m² par KWc</li>
        <li>Pistes d’accès : 0.88 m² par KWc</li>
      </ul>

      <p>Vous pourvez modifier ces superficies.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          name="photovoltaic.foundationsSurface"
          label="Fondations des panneaux"
          hintText="en m²"
          rules={{
            min: 0,
            required:
              "Ce champ est nécessaire pour déterminer les questions suivantes",
          }}
          control={control}
        />

        <NumericInput
          name="photovoltaic.accessPathsSurface"
          label="Pistes d’accès"
          hintText="en m²"
          rules={{
            min: 0,
            required:
              "Ce champ est nécessaire pour déterminer les questions suivantes",
          }}
          control={control}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default PhotovoltaicInfrastructureSurfacesForm;
