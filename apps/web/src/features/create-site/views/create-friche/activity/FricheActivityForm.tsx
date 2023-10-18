import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";

import { FricheActivity } from "@/features/create-site/domain/friche.types";

const FRICHE_ACTIVITY_OPTIONS = [
  {
    value: FricheActivity.INDUSTRY,
    label: "Friche industrielle (usine, mine, carrière...)",
  },
  {
    value: FricheActivity.MILITARY,
    label: "Friche militaire",
  },
  {
    value: FricheActivity.RAILWAY,
    label: "Friche ferroviaire (voies ferrées, gare...)",
  },
  {
    value: FricheActivity.PORT,
    label: "Friche portuaire (ports, chantiers navals...)",
  },
  {
    value: FricheActivity.AGRICULTURE,
    label: "Friche agricole",
  },
  {
    value: FricheActivity.HOSPITAL,
    label: "Friche hospitalière",
  },
  {
    value: FricheActivity.ADMINISTRATION,
    label: "Friche administrative (école, mairie...)",
  },
  {
    value: FricheActivity.BUSINESS,
    label: "Friche commerciale (ZAC, hôtel, restaurant...)",
  },
  {
    value: FricheActivity.HOUSING,
    label: "Friche d’habitat (immeuble, quartier résidentiel...)",
  },
] as const;

export type FormValues = {
  activity: FricheActivity;
};

type Props = {
  onSubmit: (formData: FormValues) => void;
};

function FricheActivityForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const error = errors.activity;

  const options = FRICHE_ACTIVITY_OPTIONS.map((activity) => ({
    ...activity,
    nativeInputProps: {
      value: activity.value,
      ...register("activity", {
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

export default FricheActivityForm;
