import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues?: FormValues;
  currentOwnerName?: string;
  isCurrentUserSiteOwner: boolean;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  willSiteBePurchased: "yes" | "no" | null;
};

function SitePurchasedForm({
  initialValues,
  onSubmit,
  onBack,
  currentOwnerName,
  isCurrentUserSiteOwner,
}: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const title = isCurrentUserSiteOwner
    ? "Allez-vous revendre le site ?"
    : `Le site sera-t-il racheté ${currentOwnerName ? `à ${currentOwnerName}` : "au propriétaire"} ?`;

  return (
    <WizardFormLayout title={title}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("willSiteBePurchased")}
          options={[
            {
              label: "Oui",
              value: "yes",
            },
            {
              label: "Non / Ne sait pas",
              value: "no",
            },
          ]}
          error={formState.errors.willSiteBePurchased}
        />
        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={watch("willSiteBePurchased") !== null ? "Valider" : "Passer"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default SitePurchasedForm;
