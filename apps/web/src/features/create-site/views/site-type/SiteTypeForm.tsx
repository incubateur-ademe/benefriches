import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  isFriche: "yes" | "no";
};

const requiredMessage =
  "Ce champ est nécessaire pour déterminer les questions suivantes";

function SiteTypeForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const error = formState.errors.isFriche;

  const options = [
    {
      label: "Oui",
      value: "yes",
    },
    {
      label: "Non",
      value: "no",
    },
  ];

  return (
    <>
      <h2>Votre site est-il une friche ?</h2>
      <p>
        Une friche est un terrain ou un bâtiment ayant été utilisé mais qui ne
        l’est plus à l’heure actuelle.
      </p>
      <p>
        Une friche peut être industrielle, militaire, ferroviaire, portuaire...
        mais aussi agricole, hospitalière, administrative, commerciale ou
        d’habitat.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("isFriche", { required: requiredMessage })}
          options={options}
          error={error}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default SiteTypeForm;
