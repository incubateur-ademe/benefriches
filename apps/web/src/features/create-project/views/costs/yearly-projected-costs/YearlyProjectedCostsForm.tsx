import { Controller, useForm } from "react-hook-form";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  defaultValues?: {
    rent: number;
    maintenance: number;
    taxes: number;
  };
};

export type FormValues = {
  rentAmount?: number;
  maintenanceAmount?: number;
  taxesAmount?: number;
  otherAmount?: number;
};

const YearlyProjectedCostsForm = ({ onSubmit, onBack, defaultValues }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: {
      rentAmount: defaultValues?.rent,
      maintenanceAmount: defaultValues?.maintenance,
      taxesAmount: defaultValues?.taxes,
    },
  });

  const allCosts = watch();

  return (
    <WizardFormLayout
      title="Dépenses annuelles"
      instructions={
        <>
          <p>
            Les montants pré-remplis le sont d'après la puissance d'installation que vous avez
            renseigné (exprimée en kWc) et les coûts moyens observés.
          </p>
          <p>
            <strong>Source&nbsp;: </strong>
            <br />
            <ExternalLink href="https://www.cre.fr/documents/Publications/Rapports-thematiques/Couts-et-rentabilites-du-grand-photovoltaique-en-metropole-continentale">
              Commission de régulation de l'énergie
            </ExternalLink>
          </p>
          <p>Vous pouvez modifier ces montants.</p>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="rentAmount"
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
                label="Loyer"
                hintInputText="€"
                className="!tw-pt-4 !tw-mb-3"
              />
            );
          }}
        />
        <Controller
          control={control}
          name="maintenanceAmount"
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
                label="Maintenance"
                hintInputText="€"
                className="!tw-pt-4 !tw-mb-3"
              />
            );
          }}
        />
        <Controller
          control={control}
          name="taxesAmount"
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
                label="Taxes et impôts"
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
                label="Autres dépenses"
                hintInputText="€"
                className="!tw-pt-4 !tw-mb-3"
              />
            );
          }}
        />

        <p>
          <strong>
            Total des dépenses annuelles : {formatNumberFr(sumObjectValues(allCosts))} €
          </strong>
        </p>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
};

export default YearlyProjectedCostsForm;
