import { useForm } from "react-hook-form";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
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

const PhotovoltaicPanelsInstallationCostsForm = ({ onSubmit, onBack, defaultValues }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: {
      worksAmount: defaultValues?.works,
      technicalStudyAmount: defaultValues?.technicalStudy,
      otherAmount: defaultValues?.other,
    },
  });

  const allCosts = watch();

  return (
    <WizardFormLayout
      title="Coûts prévisionnels d'installation des panneaux photovoltaïques"
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
        <NumericInput
          control={control}
          label="Travaux d'installation"
          hintText="€"
          name="worksAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />
        <NumericInput
          control={control}
          label="Études et honoraires techniques"
          hintText="€"
          name="technicalStudyAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />
        <NumericInput
          control={control}
          label="Autres dépenses d'installation"
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
            Total des coûts d'installation : {formatNumberFr(sumObjectValues(allCosts))} €
          </strong>
        </p>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
};

export default PhotovoltaicPanelsInstallationCostsForm;
