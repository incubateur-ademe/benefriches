import { useForm } from "react-hook-form";
import { FricheActivity } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

const FRICHE_ACTIVITY_OPTIONS = [
  {
    value: "INDUSTRY",
    label: "Friche industrielle (usine, mine, carrière...)",
  },
  {
    value: "MILITARY",
    label: "Friche militaire",
  },
  {
    value: "RAILWAY",
    label: "Friche ferroviaire (voies ferrées, gare...)",
  },
  {
    value: "PORT",
    label: "Friche portuaire (ports, chantiers navals...)",
  },
  {
    value: "AGRICULTURE",
    label: "Friche agricole",
  },
  {
    value: "TIP_OR_RECYCLING_SITE",
    label: "Ancienne décharge ou site de recyclage",
  },
  {
    value: "BUILDING",
    label: "Ancien bâtiment (public, commercial ou d'habitation)",
  },
  {
    value: "OTHER",
    label: "Autre",
  },
] satisfies { value: FricheActivity; label: string }[];

export type FormValues = {
  activity: FricheActivity;
};

type Props = {
  initialValues: Partial<FormValues>;
  onSubmit: (formData: FormValues) => void;
  onBack: () => void;
};

const requiredMessage =
  "Si vous ne savez pas qualifier l'activité de la friche, sélectionner « Autre / Ne sait pas ». Vous pourrez revenir plus tard préciser votre réponse.";

function FricheActivityForm({ initialValues, onSubmit, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({ defaultValues: initialValues });

  const error = errors.activity;

  return (
    <WizardFormLayout title="De quel type de friche s'agit-il ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("activity", {
            required: requiredMessage,
          })}
          options={FRICHE_ACTIVITY_OPTIONS}
          error={error}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!isValid} nextLabel="Valider" />
      </form>
    </WizardFormLayout>
  );
}

export default FricheActivityForm;
