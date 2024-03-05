import { useForm } from "react-hook-form";
import SustainableSoilsReinstatementInfoButton from "./SustainableSoilsReinstatementInfoButton";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { sumObjectValues } from "@/shared/services/sum/sum";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";
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
      title="Coûts prévisionnels des travaux de remise en état de la friche"
      instructions={
        <ReinstatementCostFormExplanation
          hasContaminatedSoils={hasContaminatedSoils}
          hasImpermeableSurface={hasImpermeableSurface}
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          label="Évacuation et traitement des déchets"
          hintText="€"
          name="wasteCollectionAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
        />
        <NumericInput
          control={control}
          label="Désamiantage"
          hintText="€"
          name="asbestosRemovalAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
        />

        <NumericInput
          control={control}
          label="Déconstruction"
          hintText="€"
          name="demolitionAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
        />

        {hasContaminatedSoils && (
          <NumericInput
            control={control}
            label="Dépollution des sols"
            hintText="€"
            name="remediationAmount"
            rules={{
              min: {
                value: 0,
                message: "Veuillez entrer un montant valide",
              },
            }}
          />
        )}

        <NumericInput
          control={control}
          label="Désimperméabilisation"
          hintText="€"
          name="deimpermeabilizationAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
        />

        <NumericInput
          control={control}
          label={
            <>
              Restauration écologique des sols
              <SustainableSoilsReinstatementInfoButton />
            </>
          }
          hintText="€"
          name="sustainableSoilsReinstatementAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
        />
        <NumericInput
          control={control}
          label="Autres dépenses de remise en état"
          hintText="€"
          name="otherReinstatementCostAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez entrer un montant valide",
            },
          }}
        />
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
