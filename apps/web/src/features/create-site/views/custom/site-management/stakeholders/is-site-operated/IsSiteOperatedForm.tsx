import { useForm } from "react-hook-form";
import { SiteNature } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues: FormValues;
  siteNature: SiteNature | undefined;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  isSiteOperated: "yes" | "no" | null;
};

const getTitle = (siteNature: SiteNature | undefined) => {
  switch (siteNature) {
    case "AGRICULTURAL_OPERATION":
      return `L'exploitation agricole est-elle encore en activité ?`;
    case "NATURAL_AREA":
      return `L'espace naturel est-il exploité ?`;
    default:
      return "Le site est-il exploité ?";
  }
};

function IsSiteOperatedForm({ initialValues, siteNature, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <WizardFormLayout title={getTitle(siteNature)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("isSiteOperated")}
          options={[
            {
              label: `Oui`,
              value: "yes",
            },
            {
              label: "Non / Ne sait pas",
              value: "no",
            },
          ]}
          error={formState.errors.isSiteOperated}
        />
        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={watch("isSiteOperated") !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default IsSiteOperatedForm;
