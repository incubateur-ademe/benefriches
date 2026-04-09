import { useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import FormRowNumericInput from "@/shared/views/components/form/NumericInput/FormRowNumericInput";
import FormAutoInfo from "@/shared/views/layout/WizardFormLayout/FormAutoInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  initialValues?: FormValues;
};

export type FormValues = Record<"product-sales" | "subsidies" | "other", number | undefined>;

function SiteYearlyIncomeForm({ onSubmit, onBack, initialValues }: Props) {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  const formValues = watch();

  const hasNoValuesFilled =
    typedObjectEntries(formValues).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout
      title="Recettes annuelles liées à l'exploitation"
      instructions={
        <FormAutoInfo>
          D’où viennent les montants pré-remplis ? Montants calculés d’après les informations que
          vous avez renseigné et les dépenses financiers moyens en France de chaque poste de
          dépense. En savoir plus
          <span>Sources&nbsp;:</span>
          <ul>
            <li>
              <ExternalLink href="https://agreste.agriculture.gouv.fr/agreste-web/download/publication/publie/Chd2418/cd2024-18_Rica2023-v2.pdf">
                Résultats économiques des exploitations agricoles en France - Chiffres clés 2023
                RICA
              </ExternalLink>
            </li>
          </ul>
        </FormAutoInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRowNumericInput
          controller={{ name: "product-sales", control }}
          addonText="€ / an"
          label="Vente de produits"
          className="pt-4!"
        />

        <FormRowNumericInput
          controller={{ name: "subsidies", control }}
          addonText="€ / an"
          label="Subventions"
          className="pt-4!"
        />

        <FormRowNumericInput
          controller={{ name: "other", control }}
          addonText="€ / an"
          label="Autres recettes"
          className="pt-4!"
        />

        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={hasNoValuesFilled ? "Passer" : "Valider"}
        />
      </form>
    </WizardFormLayout>
  );
}

export default SiteYearlyIncomeForm;
