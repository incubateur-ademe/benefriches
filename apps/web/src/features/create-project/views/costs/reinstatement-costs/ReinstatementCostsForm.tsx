import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

type Props = {
  onSubmit: (data: FormValues) => void;
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
          name="wasteCollectionAmount"
        />
        <NumericInput
          control={control}
          label="Désamiantage"
          hintText="€"
          name="asbestosRemovalAmount"
        />
        <NumericInput
          control={control}
          label="Déconstruction"
          hintText="€"
          name="demolitionAmount"
        />
        <NumericInput
          control={control}
          label="Dépollution"
          hintText="€"
          name="remediationAmount"
        />
        <NumericInput
          control={control}
          label="Désimperméabilisation"
          hintText="€"
          name="deimpermeabilizationAmount"
        />
        <NumericInput
          control={control}
          label="Restauration écologique des sols"
          hintText="€"
          name="sustainableSoilsReinstatementAmount"
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
