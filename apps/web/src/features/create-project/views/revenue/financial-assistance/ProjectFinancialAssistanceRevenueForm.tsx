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

  const allRevenues = watch();

  return (
    <WizardFormLayout
      title="Aides financières"
      instructions={
        <FormDefinition hideDivider>
          <p>Les aides financières de l’opération peuvent avoir différentes origines&nbsp;:</p>
          <ul>
            <li>
              Les subventions publiques (État, Région, ADEME, etc.) attribuées pour financer
              certaines dépenses (remise en état) ou pour soutenir le financement participatif,
            </li>

            <li>D’autres ressources le cas échéant.</li>
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
            Total des aides aux travaux : {formatNumberFr(sumObjectValues(allRevenues))} €
          </strong>
        </p>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
};

export default ProjectFinancialAssistanceRevenueForm;
