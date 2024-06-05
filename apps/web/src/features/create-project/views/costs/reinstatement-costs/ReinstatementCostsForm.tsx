import { Controller, useForm } from "react-hook-form";
import SustainableSoilsReinstatementInfoButton from "./SustainableSoilsReinstatementInfoButton";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import ControlledRowNumericInput from "@/shared/views/components/form/NumericInput/ControlledRowNumericInput";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  hasBuildings: boolean;
  hasContaminatedSoils: boolean;
  hasImpermeableSoils: boolean;
};

export type FormValues = {
  wasteCollectionAmount?: number;
  asbestosRemovalAmount?: number;
  demolitionAmount?: number;
  remediationAmount?: number;
  deimpermeabilizationAmount?: number;
  sustainableSoilsReinstatementAmount?: number;
  otherReinstatementCostAmount?: number;
};

const ReinstatementCostFormExplanation = ({
  hasContaminatedSoils,
  hasImpermeableSurface,
}: {
  hasContaminatedSoils: boolean;
  hasImpermeableSurface: boolean;
}) => {
  if (hasContaminatedSoils) {
    if (hasImpermeableSurface) {
      return (
        <section>
          <p>
            Le site que vous allez aménager est une friche partiellement imperméable et
            partiellement polluée.
          </p>
          <p>
            Vous allez donc potentiellement engager des travaux de déconstruction (bâtiments
            obsolètes, désimperméabilisation de parking et voiries etc...) et des travaux de
            dépollution.
          </p>
        </section>
      );
    }
    return (
      <section>
        <p>Le site que vous allez aménager est une friche partiellement polluée.</p>
        <p>Vous allez donc potentiellement engager des travaux de dépollution.</p>
      </section>
    );
  } else {
    if (hasImpermeableSurface) {
      return (
        <section>
          <p>Le site que vous allez aménager est une friche partiellement imperméable.</p>
          <p>
            Vous allez donc potentiellement engager des travaux de déconstruction (bâtiments
            obsolètes, désimperméabilisation de parking et voiries etc...)
          </p>
        </section>
      );
    }
    return (
      <section>
        <p>
          Le site que vous allez aménager est une friche. Vous allez donc potentiellement engager
          des travaux de remise en état pour la rendre exploitable.
        </p>
      </section>
    );
  }
};

const getCostsInputs = (hasContaminatedSoils: boolean) => {
  const costs = [
    { name: "asbestosRemovalAmount", label: "Désamiantage" },
    { name: "remediationAmount", label: "Dépollution des sols" },
    { name: "demolitionAmount", label: "Déconstruction" },
    { name: "deimpermeabilizationAmount", label: "Désimperméabilisation" },
    { name: "wasteCollectionAmount", label: "Évacuation et traitement des déchets" },
    {
      name: "sustainableSoilsReinstatementAmount",
      label: (
        <>
          Restauration écologique des sols
          <SustainableSoilsReinstatementInfoButton />
        </>
      ),
    },
    { name: "otherReinstatementCostAmount", label: "Autres dépenses de remise en état" },
  ] as const;
  return hasContaminatedSoils ? costs.filter(({ name }) => name !== "remediationAmount") : costs;
};

const ReinstatementsCostsForm = ({
  onSubmit,
  onBack,
  hasContaminatedSoils,
  hasBuildings,
  hasImpermeableSoils,
}: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>();

  const allCosts = watch();

  const hasImpermeableSurface = hasBuildings || hasImpermeableSoils;

  return (
    <WizardFormLayout
      title="Coûts des travaux de remise en état de la friche"
      instructions={
        <FormInfo>
          <ReinstatementCostFormExplanation
            hasContaminatedSoils={hasContaminatedSoils}
            hasImpermeableSurface={hasImpermeableSurface}
          />
        </FormInfo>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {getCostsInputs(hasContaminatedSoils).map(({ label, name }) => (
          <Controller
            key={name}
            control={control}
            name={name}
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
                  label={label}
                  hintInputText="€"
                  className="!tw-pt-4 !tw-mb-0"
                />
              );
            }}
          />
        ))}

        <p>
          <strong>
            Total des coûts des travaux de remise en état :{" "}
            {formatNumberFr(sumObjectValues(allCosts))} €
          </strong>
        </p>
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
};

export default ReinstatementsCostsForm;
