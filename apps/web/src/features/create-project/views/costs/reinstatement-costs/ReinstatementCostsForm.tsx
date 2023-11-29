import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
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
};

const sumAmounts = (amounts: FormValues): number => {
  return Object.values(amounts).reduce((sum, amount) => sum + (amount ?? 0), 0);
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
            Le site que vous allez aménager est une friche partiellement
            imperméable et partiellement polluée.
          </p>
          <p>
            Vous allez donc potentiellement engager des travaux de
            déconstruction (bâtiments obsolètes, désimperméabilisation de
            parking et voiries etc...) et des travaux de dépollution.
          </p>
        </section>
      );
    }
    return (
      <section>
        <p>
          Le site que vous allez aménager est une friche partiellement polluée.
        </p>
        <p>
          Vous allez donc potentiellement engager des travaux de dépollution.
        </p>
      </section>
    );
  } else {
    if (hasImpermeableSurface) {
      return (
        <section>
          <p>
            Le site que vous allez aménager est une friche partiellement
            imperméable.
          </p>
          <p>
            Vous allez donc potentiellement engager des travaux de
            déconstruction (bâtiments obsolètes, désimperméabilisation de
            parking et voiries etc...)
          </p>
        </section>
      );
    }
    return (
      <section>
        <p>
          Le site que vous allez aménager est une friche. Vous allez donc
          potentiellement engager des travaux de remise en état pour la rendre
          exploitable.
        </p>
      </section>
    );
  }
};

const ReinstatementsCostsForm = ({
  onSubmit,
  hasContaminatedSoils,
  hasBuildings,
  hasImpermeableSoils,
}: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>();

  const allCosts = watch();

  const hasImpermeableSurface = hasBuildings || hasImpermeableSoils;

  return (
    <>
      <h2>Coûts de travaux de la remise en état de la friche</h2>
      <ReinstatementCostFormExplanation
        hasContaminatedSoils={hasContaminatedSoils}
        hasImpermeableSurface={hasImpermeableSurface}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          label="Enlèvement des déchets"
          hintText="€"
          name="wasteCollectionAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
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
              message: "Veuillez sélectionner un montant valide",
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
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />

        {hasContaminatedSoils && (
          <NumericInput
            control={control}
            label="Dépollution"
            hintText="€"
            name="remediationAmount"
            rules={{
              min: {
                value: 0,
                message: "Veuillez sélectionner un montant valide",
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
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />

        <NumericInput
          control={control}
          label="Restauration écologique des sols"
          hintText="€"
          name="sustainableSoilsReinstatementAmount"
          rules={{
            min: {
              value: 0,
              message: "Veuillez sélectionner un montant valide",
            },
          }}
        />
        <p>
          <strong>
            Total des coûts des travaux de remise en état :{" "}
            {formatNumberFr(sumAmounts(allCosts))} €
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
    </>
  );
};

export default ReinstatementsCostsForm;
