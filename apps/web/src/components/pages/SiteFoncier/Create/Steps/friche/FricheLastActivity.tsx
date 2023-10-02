import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";

import { FricheLastActivity } from "@/components/pages/SiteFoncier/friche";

const ERROR_MESSAGE =
  "Si vous ne savez pas qualifier l’activité de la friche, sélectionner « Autre / NSP ». Vous pourrez revenir plus tard préciser votre réponse.";

const OTHER_VALUE = "OTHER";

const FRICHE_ACTIVITY_OPTIONS = [
  {
    value: FricheLastActivity.INDUSTRY,
    label: "Industrie, transport, zone commerciale ou militaire",
  },
  {
    value: FricheLastActivity.MINE_OR_QUARRY,
    label: "Mine ou Carrière",
  },
  {
    value: FricheLastActivity.AGRICULTURE,
    label: "Agriculture",
  },
  {
    value: FricheLastActivity.HOUSING_OR_BUSINESS,
    label: "Habitat, petit commerce, équipement public",
  },
  {
    value: OTHER_VALUE,
    label: "Autre / NSP",
  },
] as const;

type FormValues = {
  lastActivity: FricheLastActivity | typeof OTHER_VALUE;
};

type Props = {
  onSubmit: (data: { lastActivity: FricheLastActivity | null }) => void;
  onBack: () => void;
};

function FricheLastActivityForm({ onSubmit, onBack }: Props) {
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

  const _onSubmit = handleSubmit((data) => {
    if (data.lastActivity === OTHER_VALUE) {
      onSubmit({ lastActivity: null });
      return;
    }
    onSubmit(data as { lastActivity: FricheLastActivity });
  });

  return (
    <>
      <h2>Quelle est la dernière activité connue de la friche ?</h2>
      <form onSubmit={_onSubmit}>
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

export default FricheLastActivityForm;
