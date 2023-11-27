import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";

import NumericInput from "@/shared/views/components/form/NumericInput/NumericInput";

export type FormValues = {
  waterTreatmentYearlyExpenses?: number;
  floodsRegulationYearlyExpenses?: number;
};

type Props = {
  askForWaterTreatmentExpenses: boolean;
  askForFloodsRegulationExpenses: boolean;
  onSubmit: (data: FormValues) => void;
};

function SoilsDegradationYearlyExpenses({
  onSubmit,
  askForWaterTreatmentExpenses,
  askForFloodsRegulationExpenses,
}: Props) {
  const { control, handleSubmit } = useForm<FormValues>();

  return (
    <>
      <h2>Coûts annuels liés à la sécurisation de la friche</h2>
      <p>
        Sauf en cas de défaillance de l’exploitant (faillite...), les coûts de
        gardiennage, d’entretien, de débarras de dépôt sauvage sont
        habituellement à la charge de l’exploitant.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {askForWaterTreatmentExpenses && (
          <NumericInput
            name="waterTreatmentYearlyExpenses"
            control={control}
            label="Coûts de traitement des eaux"
            hintText="€ / an"
            rules={{
              min: {
                value: 0,
                message: "Veuillez sélectionner un montant valide",
              },
            }}
          />
        )}
        {askForFloodsRegulationExpenses && (
          <NumericInput
            name="floodsRegulationYearlyExpenses"
            control={control}
            label="Coûts de régulation des inondations"
            hintText="€ / an"
            rules={{
              min: {
                value: 0,
                message: "Veuillez sélectionner un montant valide",
              },
            }}
          />
        )}
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
}

export default SoilsDegradationYearlyExpenses;
