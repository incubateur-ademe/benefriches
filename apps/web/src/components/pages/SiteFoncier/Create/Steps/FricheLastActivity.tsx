import { FieldError, useFormContext } from "react-hook-form";

import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";

const KEY = "lastActivity";
const ERROR_MESSAGE =
  "Si vous ne savez pas qualifier l’activité de la friche, sélectionner « Autre / NSP ». Vous pourrez revenir plus tard préciser votre réponse.";

const ACTIVITIES = [
  {
    value: "agricole",
    label: "Agriculture",
  },
  {
    value: "industrial",
    label: "Industrie, transport, zone commerciale ou militaire",
  },
  {
    value: "quarry",
    label: "Mine ou Carrière",
  },
  {
    value: "other",
    label: "Autre / NSP",
  },
];

function SiteFoncierCreationStepFricheLastActivity() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[KEY] as FieldError;

  const options = ACTIVITIES.map((activity) => ({
    ...activity,
    nativeInputProps: {
      value: activity.value,
      ...register(KEY, {
        required: ERROR_MESSAGE,
      }),
    },
  }));

  return (
    <>
      <h2>Quels espaces y a t-il sur cette friche ?</h2>

      <RadioButtons options={options} />

      {errors[KEY] && <p>{error.message}</p>}
    </>
  );
}

export default SiteFoncierCreationStepFricheLastActivity;
