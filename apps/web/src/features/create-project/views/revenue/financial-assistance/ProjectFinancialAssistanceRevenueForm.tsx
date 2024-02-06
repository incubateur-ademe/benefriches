import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { sumObjectValues } from "@/shared/services/sum/sum";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  localOrRegionalAuthorityAmount?: number;
  publicSubsidiesAmount?: number;
  otherAmount?: number;
};

const ProjectFinancialAssistanceRevenueForm = ({ onSubmit }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>();

  const allCosts = watch();

  return (
    <WizardFormLayout
      title="Aides financières aux travaux"
      instructions={
        <>
          <span className="fr-text--lg">💡</span>

          <p>Les recettes de l’opération peuvent avoir différentes origines&nbsp;:</p>
          <ul>
            <li>
              Le produit attendu de la vente de droits à construire aux promoteurs ou de la vente
              directe de terrains aménagés aux particuliers ou aux entreprises utilisatrices
              (promoteurs, etc.),
            </li>
            <li>
              Les contributions publiques de collectivités : ventes de foncier pour équipements et
              espaces publics à la collectivité, participation pour remise d’ouvrage (en
              concession), apport en nature (foncier, etc.), subvention d’équilibre (concédant ou
              régie),
            </li>
            <li>
              Les subventions publiques (Etat, région, ANAH, ANRU, ADEME, etc.) attribuées pour
              financer certaines dépenses.
            </li>
          </ul>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          label="Participation des collectivités"
          hintText="€"
          name="localOrRegionalAuthorityAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />
        <NumericInput
          control={control}
          label="Subvention publiques"
          hintText="€"
          name="publicSubsidiesAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />
        <NumericInput
          control={control}
          label="Autres ressources"
          hintText="€"
          name="otherAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />
        <p>
          <strong>
            Total des aides aux travaux : {formatNumberFr(sumObjectValues(allCosts))} €
          </strong>
        </p>
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
    </WizardFormLayout>
  );
};

export default ProjectFinancialAssistanceRevenueForm;
