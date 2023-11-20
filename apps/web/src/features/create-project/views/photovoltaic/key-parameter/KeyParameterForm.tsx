import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";

import { PhotovoltaicKeyParameter } from "@/features/create-project/domain/project.types";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  photovoltaicKeyParameter: PhotovoltaicKeyParameter;
};

const requiredMessage =
  "Ce champ est nécessaire pour déterminer les questions suivantes";

function KeyParameterForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const error = formState.errors.photovoltaicKeyParameter;

  const options = [
    {
      label: "La puissance de l’installation",
      value: PhotovoltaicKeyParameter.POWER,
    },
    {
      label: "La superficie de l’installation",
      value: PhotovoltaicKeyParameter.SURFACE,
    },
  ];

  return (
    <>
      <h2>
        Quel est le paramètre déterminant pour votre projet photovoltaïque ?
      </h2>
      <p>
        Si vous savez déjà quelle puissance doit faire l’installation,
        sélectionnez «&nbsp;La puissance d’installation&nbsp;». Bénéfriches
        calculera alors la superficie au sol requise.
      </p>
      <p>
        Si vous souhaitez que la puissance d’installation s’adapte à une
        certaine superficie au sol, sélectionnez «&nbsp;La superficie de
        l’installation&nbsp;». Bénéfriches calculera alors la puissance que
        pourra faire votre installation.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("photovoltaicKeyParameter", {
            required: requiredMessage,
          })}
          options={options}
          error={error}
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default KeyParameterForm;
