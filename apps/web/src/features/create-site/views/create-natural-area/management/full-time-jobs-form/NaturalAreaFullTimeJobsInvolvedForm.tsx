import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  fullTimeJobsInvolved: number;
};

const validatePositiveNumber = (value: number) => {
  if (isNaN(value) || value < 0) {
    return "La valeur renseignée doit être un nombre supérieur à zéro.";
  }
  return true;
};

function NaturalAreaFullTimeJobsInvolvedForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();

  const error = formState.errors.fullTimeJobsInvolved;

  return (
    <>
      <h2>
        Emplois temps plein mobilisés pour l'exploitation de l'espace naturel
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Emplois temps plein"
          state={error ? "error" : "default"}
          stateRelatedMessage={error ? error.message : undefined}
          nativeInputProps={{
            type: "number",
            ...register("fullTimeJobsInvolved", {
              required: "Ce champ est requis",
              valueAsNumber: true,
              validate: validatePositiveNumber,
            }),
          }}
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

export default NaturalAreaFullTimeJobsInvolvedForm;
