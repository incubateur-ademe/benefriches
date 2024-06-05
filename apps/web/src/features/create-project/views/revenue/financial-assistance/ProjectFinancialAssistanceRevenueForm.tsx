import { Controller, useForm } from "react-hook-form";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import FormDefinition from "@/shared/views/layout/WizardFormLayout/FormDefinition";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

export type FormValues = {
  localOrRegionalAuthorityAmount?: number;
  publicSubsidiesAmount?: number;
  otherAmount?: number;
};

const ProjectFinancialAssistanceRevenueForm = ({ onSubmit, onBack }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>();

  const allCosts = watch();

  return (
    <WizardFormLayout
      title="Aides financières aux travaux"
      instructions={
        <FormDefinition hideDivider>
          <p>Les aides financières peuvent avoir différentes origines&nbsp;:</p>
          <ul>
            <li>
              Les participations publiques de collectivités : ventes de foncier pour équipements et
              espaces publics à la collectivité, participation pour remise d'ouvrage (en
              concession), apport en nature (foncier, etc.), subvention d'équilibre (concédant ou
              régie).
            </li>
            <li>
              Les subventions publiques (Etat, région, ANAH, ANRU, ADEME, etc.) attribuées pour
              financer certaines dépenses.
            </li>
            <li>
              Le produit attendu de la vente de droits à construire aux promoteurs ou de la vente
              directe de terrains aménagés aux particuliers ou aux entreprises utilisatrices
              (promoteurs, etc.).
            </li>
          </ul>
        </FormDefinition>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="localOrRegionalAuthorityAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                {...controller}
                label="Participation des collectivités"
                hintInputText="€"
                className="!tw-pt-4 !tw-mb-3"
              />
            );
          }}
        />
        <Controller
          control={control}
          name="publicSubsidiesAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                {...controller}
                label="Subvention publiques"
                hintInputText="€"
                className="!tw-pt-4 !tw-mb-3"
              />
            );
          }}
        />
        <Controller
          control={control}
          name="otherAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                {...controller}
                label="Autres ressources"
                hintInputText="€"
                className="!tw-pt-4 !tw-mb-3"
              />
            );
          }}
        />

        <p>
          <strong>
            Total des aides aux travaux : {formatNumberFr(sumObjectValues(allCosts))} €
          </strong>
        </p>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
};

export default ProjectFinancialAssistanceRevenueForm;
