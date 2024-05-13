import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  siteOwnerName?: string;
};

export type FormValues = {
  operatorCategory: "owner" | "other" | "unknown";
};

const requiredMessage = "Ce champ est requis";

function HasSiteOperatorForm({ onSubmit, onBack, siteOwnerName }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const error = formState.errors.operatorCategory;

  return (
    <WizardFormLayout title="Le site est-il encore exploité ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("operatorCategory", { required: requiredMessage })}
          options={[
            {
              label: `Oui, par le propriétaire du site, ${siteOwnerName}`,
              value: "owner",
            },
            {
              label: "Oui, par un autre exploitant",
              value: "other",
            },
            {
              label: "Non / Ne sait pas",
              value: "unknown",
            },
          ]}
          error={error}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default HasSiteOperatorForm;
