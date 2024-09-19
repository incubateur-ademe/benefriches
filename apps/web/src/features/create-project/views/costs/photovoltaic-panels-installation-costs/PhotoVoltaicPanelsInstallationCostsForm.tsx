import { Controller, useForm } from "react-hook-form";
import { typedObjectEntries } from "shared";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  defaultValues?: {
    works: number;
    technicalStudy: number;
    other: number;
  };
};

export type FormValues = {
  worksAmount?: number;
  technicalStudyAmount?: number;
  otherAmount?: number;
};

const PhotovoltaicPanelsInstallationExpensesForm = ({ onSubmit, onBack, defaultValues }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: {
      worksAmount: defaultValues?.works,
      technicalStudyAmount: defaultValues?.technicalStudy,
      otherAmount: defaultValues?.other,
    },
  });

  const allExpenses = watch();

  const hasNoValuesFilled =
    typedObjectEntries(allExpenses).filter(([, value]) => typeof value === "number").length === 0;

  return (
    <WizardFormLayout
      title="Dépenses d’installation de la centrale photovoltaïque"
      instructions={
        <FormInfo>
          <p>
            Les montants pré-remplis le sont d'après la puissance d'installation que vous avez
            renseignée (exprimée en kWc) et les dépenses moyennes observées.
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
          name="worksAmount"
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
                label="Travaux d'installation"
                hintInputText="€"
                className="!tw-pt-4 !tw-mb-3"
              />
            );
          }}
        />

        <Controller
          control={control}
          name="technicalStudyAmount"
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
                label="Études et honoraires techniques"
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
                label="Autres dépenses d'installation"
                hintInputText="€"
                className="!tw-pt-4 !tw-mb-3"
              />
            );
          }}
        />

        {!hasNoValuesFilled && (
          <p>
            <strong>
              Total des dépenses d'installation : {formatNumberFr(sumObjectValues(allExpenses))} €
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

export default PhotovoltaicPanelsInstallationExpensesForm;
