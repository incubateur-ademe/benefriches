import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";

import { FricheLastActivity } from "@/components/pages/SiteFoncier/friche";

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
    value: FricheLastActivity.UNKNOWN,
    label: "Autre / NSP",
  },
] as const;

type FormValues = {
  lastActivity: FricheLastActivity;
};

type Props = {
  onSubmit: (formData: FormValues) => void;
};

function FricheLastActivityForm({ onSubmit }: Props) {
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
        required:
          "Si vous ne savez pas qualifier l’activité de la friche, sélectionner « Autre / NSP ». Vous pourrez revenir plus tard préciser votre réponse.",
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
