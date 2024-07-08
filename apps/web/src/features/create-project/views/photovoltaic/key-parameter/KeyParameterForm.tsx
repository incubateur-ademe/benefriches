import { useForm } from "react-hook-form";

import { PhotovoltaicKeyParameter } from "@/features/create-project/domain/project.types";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  photovoltaicKeyParameter: PhotovoltaicKeyParameter;
};

const requiredMessage = "Ce champ est nécessaire pour déterminer les questions suivantes";

function KeyParameterForm({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const error = formState.errors.photovoltaicKeyParameter;

  const options = [
    {
      label: "La puissance de l'installation",
      value: PhotovoltaicKeyParameter.POWER,
    },
    {
      label: "La superficie de l'installation",
      value: PhotovoltaicKeyParameter.SURFACE,
    },
  ];

  return (
    <WizardFormLayout
      title="Quel est le paramètre déterminant pour la centrale photovoltaïque ?"
      instructions={
        <FormInfo>
          <p>
            Si vous savez déjà quelle puissance doit faire l'installation, sélectionnez «&nbsp;La
            puissance d'installation&nbsp;». Bénéfriches calculera alors la superficie au sol
            requise.
          </p>
          <p>
            Si vous souhaitez que la puissance d'installation s'adapte à une certaine superficie au
            sol, sélectionnez «&nbsp;La superficie de l'installation&nbsp;». Bénéfriches calculera
            alors la puissance que pourra faire l'installation.
          </p>

          <p>
            Si vous ne savez pas quel est le paramètre déterminant, le plus simple est de
            sélectionner «&nbsp;La superficie de l'installation&nbsp;».
          </p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("photovoltaicKeyParameter", {
            required: requiredMessage,
          })}
          options={options}
          error={error}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default KeyParameterForm;
