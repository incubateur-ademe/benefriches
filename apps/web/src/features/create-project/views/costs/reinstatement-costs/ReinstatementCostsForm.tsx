import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
};

export type FormValues = {
  wasteCollectionCost?: number;
  asbestosRemovalCost?: number;
  demolitionCost?: number;
  remediationCost?: number;
  deimpermeabilizationCost?: number;
  sustainableSoilsReinstatementCost?: number;
};

const sumAllCosts = (costs: FormValues): number => {
  return Object.values(costs).reduce((sum, cost) => sum + (cost ?? 0), 0);
};

const ReinstatementsCostsForm = ({ onSubmit }: Props) => {
  const { handleSubmit, control, watch } = useForm<FormValues>();

  const allCosts = watch();

  return (
    <>
      <h2>Coûts de travaux de la remise en état de la friche</h2>
      <p>
        Le site que vous allez aménager est une friche. Vous allez donc engager
        des travaux de déconstruction et de remise en état pour la rendre
        exploitable.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NumericInput
          control={control}
          label="Enlèvement des déchets"
          hintText="€"
          name="wasteCollectionCost"
        />
        <NumericInput
          control={control}
          label="Désamiantage"
          hintText="€"
          name="asbestosRemovalCost"
        />
        <NumericInput
          control={control}
          label="Déconstruction"
          hintText="€"
          name="demolitionCost"
        />
        <NumericInput
          control={control}
          label="Dépollution"
          hintText="€"
          name="remediationCost"
        />
        <NumericInput
          control={control}
          label="Désimperméabilisation"
          hintText="€"
          name="deimpermeabilizationCost"
        />
        <NumericInput
          control={control}
          label="Restauration écologique des sols"
          hintText="€"
          name="sustainableSoilsReinstatementCost"
        />
        <p>
          <strong>
            Total des coûts des travaux de remise en état :{" "}
            {formatNumberFr(sumAllCosts(allCosts))} €
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
