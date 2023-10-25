import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";

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
  const { register, handleSubmit } = useForm<FormValues>();

  return (
    <>
      <h2>Coûts annules liés à la sécurisation de la friche</h2>
      <p>
        Sauf en cas de défaillance de l’exploitant (faillite...), les coûts de
        gardiennage, d’entretien, de débarras de dépôt sauvage sont
        habituellement à la charge de l’exploitant.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {askForWaterTreatmentExpenses && (
          <Input
            label="Coûts de traitement des eaux"
            hintText="€ / an"
            nativeInputProps={register("waterTreatmentYearlyExpenses", {
              valueAsNumber: true,
            })}
          />
        )}
        {askForFloodsRegulationExpenses && (
          <Input
            label="Coûts de régulation des inondations"
            hintText="€ / an"
            nativeInputProps={register("floodsRegulationYearlyExpenses", {
              valueAsNumber: true,
            })}
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
