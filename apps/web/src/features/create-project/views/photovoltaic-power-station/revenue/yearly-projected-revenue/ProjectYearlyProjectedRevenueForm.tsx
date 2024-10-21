import { Controller, useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";
import { sumObjectValues } from "shared";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  defaultValues: {
    operationsAmount?: number;
  };
};

export type FormValues = {
  operationsAmount?: number;
  otherAmount?: number;
};

const ProjectYearlyProjectedRevenueForm = ({ onSubmit, onBack, defaultValues }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>({ defaultValues });

  const allRevenues = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allRevenues).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout
      title="Recettes annuelles"
      instructions={
        <FormInfo>
          <p>
            Les montants pré-remplis le sont d'après la puissance d'installation que vous avez
            renseigné (exprimée en kWc) et les dépenses moyennes observées.
          </p>
          <p>
            <strong>Source&nbsp;: </strong>
            <br />
            <ExternalLink href="https://www.cre.fr/documents/Publications/Rapports-thematiques/Couts-et-rentabilites-du-grand-photovoltaique-en-metropole-continentale">
              Commission de régulation de l'énergie
            </ExternalLink>
          </p>
          <p>Vous pouvez modifier ces montants.</p>
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="operationsAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
          render={(controller) => {
            return (
              <ControlledRowNumericInput
                controlProps={controller}
                label="Recettes d'exploitation"
                addonText="€ / an"
                className="!tw-pt-4"
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
                controlProps={controller}
                label="Autres recettes"
                addonText="€ / an"
                className="!tw-pt-4"
              />
            );
          }}
        />

        {!hasNoValuesFilled && (
          <p>
            <strong>
              Total des recettes annuelles : {formatNumberFr(sumObjectValues(allRevenues))} €
            </strong>
          </p>
        )}

        <BackNextButtonsGroup
          onBack={onBack}
          nextLabel={hasNoValuesFilled ? "Passer" : "Valider"}
        />
      </form>
    </WizardFormLayout>
  );
};

export default ProjectYearlyProjectedRevenueForm;
