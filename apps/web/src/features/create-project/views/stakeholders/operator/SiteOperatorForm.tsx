import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { Project } from "@/features/create-project/domain/project.types";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FutureOperatorOption = Exclude<Project["futureOperator"], undefined>;

export type FormValues = {
  futureOperator: FutureOperatorOption;
};

const requiredMessage = "Champ requis";

const options = [
  {
    label: "La collectivité",
    value: "local_or_regional_authority",
  },
  {
    label: "Mon entreprise",
    value: "user_company",
  },
  {
    label: "Une autre entreprise",
    value: "other_company",
  },
];

function SiteOperatorForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  return (
    <>
      <h2>Qui sera l'exploitant du site ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("futureOperator", { required: requiredMessage })}
          options={options}
          error={formState.errors.futureOperator}
        />
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Suivant",
              nativeButtonProps: { type: "submit" },
            },
          ]}
        />
      </form>
    </>
  );
}

export default SiteOperatorForm;
