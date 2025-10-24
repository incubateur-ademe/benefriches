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
  siteResalePlanned: "yes" | "no" | null;
};

function SiteResaleForm({ initialValues, onSubmit, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <WizardFormLayout
      title="Y aura-t-il une cession foncière suite à l'aménagement du site ?"
      instructions={
        <>
          <p>
            Si c’est un ou plusieurs acteurs ou opérateurs (promoteur, bailleur social,
            collectivité...) qui se chargent entièrement ou en partie de la
            construction-réhabilitation, ceux-ci devront acheter les terrains viabilisés.
          </p>
          <p>
            La question du prix de la cession foncière vous sera posée dans une étape ultérieure.
          </p>
        </>
      }
    >
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
          ]}
          error={formState.errors.siteResalePlanned}
        />
        <BackNextButtonsGroup onBack={onBack} disabled={!formState.isValid} />
      </form>
    </WizardFormLayout>
  );
}

export default SiteResaleForm;
