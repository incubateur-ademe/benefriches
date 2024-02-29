import { useForm } from "react-hook-form";

import { FricheActivity } from "@/features/create-site/domain/friche.types";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

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
  {
    value: FricheActivity.OTHER,
    label: "Autre",
  },
];

export type FormValues = {
  activity: FricheActivity;
};

type Props = {
  onSubmit: (formData: FormValues) => void;
  onBack: () => void;
};

const requiredMessage =
  "Si vous ne savez pas qualifier l’activité de la friche, sélectionner « Autre / NSP ». Vous pourrez revenir plus tard préciser votre réponse.";

function FricheActivityForm({ onSubmit, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const error = errors.activity;

  return (
    <WizardFormLayout title="De quel type de friche s’agit-il ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("activity", {
            required: requiredMessage,
          })}
          options={FRICHE_ACTIVITY_OPTIONS}
          error={error}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default FricheActivityForm;
