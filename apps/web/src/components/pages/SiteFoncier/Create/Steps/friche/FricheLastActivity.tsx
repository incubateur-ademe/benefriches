import { useForm } from "react-hook-form";

import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

const ERROR_MESSAGE =
  "Si vous ne savez pas qualifier l’activité de la friche, sélectionner « Autre / NSP ». Vous pourrez revenir plus tard préciser votre réponse.";

const FRICHE_ACTIVITY_OPTIONS = [
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
    value: "accomodation",
    label: "Habitat, petit commerce, équipement public",
  },
  {
    value: "other",
    label: "Autre / NSP",
  },
] as const;

type FormValues = {
  lastActivity: (typeof FRICHE_ACTIVITY_OPTIONS)[number]["value"];
};

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function SiteFoncierCreationStepFricheLastActivity({
  onSubmit,
  onBack,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const error = errors.lastActivity;

  const options = FRICHE_ACTIVITY_OPTIONS.map((activity) => ({
    ...activity,
    nativeInputProps: {
      value: activity.value,
      ...register("lastActivity", {
        required: ERROR_MESSAGE,
      }),
    },
  }));

  return (
    <>
      <h2>Quelle est la dernière activité connue de la friche ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          options={options}
          state={error ? "error" : "default"}
          stateRelatedMessage={error ? error.message : undefined}
        />
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Retour",
              onClick: onBack,
              priority: "secondary",
              nativeButtonProps: { type: "button" },
            },
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

export default SiteFoncierCreationStepFricheLastActivity;
