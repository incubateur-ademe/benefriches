import { useForm } from "react-hook-form";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

type FormValues = {
  siteResalePlanned: "yes" | "no" | "unknown" | null;
};

function SiteResaleForm({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <WizardFormLayout title="Y aura-t-il une cession foncière suite à l'aménagement du site ?">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("siteResalePlanned", { required: true })}
          options={[
            {
              label: "Oui, un ou plusieurs acteurs ou opérateurs acquerront entièrement le site",
              value: "yes",
            },
            {
              label: "Non, l'aménageur restera entièrement propriétaire du site",
              value: "no",
            },
            {
              label: "Je ne sais pas",
              value: "unknown",
              hintText:
                "Bénéfriches considèrera que le foncier est revendu, ceci étant le cas le plus fréquent.",
            },
          ]}
          error={formState.errors.siteResalePlanned}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteResaleForm;
