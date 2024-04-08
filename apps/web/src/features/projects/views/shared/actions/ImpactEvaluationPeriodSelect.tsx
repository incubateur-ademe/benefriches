import { fr } from "@codegouvfr/react-dsfr";
import Select from "@codegouvfr/react-dsfr/SelectNext";

const values = ["1", "2", "3", "4", "5", "10", "15", "20", "25", "30", "40", "50"] as const;

type Props = {
  value: number;
  onChange: (n: number) => void;
};

function ImpactEvaluationPeriodSelect({ value, onChange }: Props) {
  return (
    <Select
      className={fr.cx("fr-mb-1w")}
      label=""
      nativeSelectProps={{
        value: value.toString() as (typeof values)[number],
        onChange: (e) => {
          onChange(parseInt(e.currentTarget.value, 10));
        },
      }}
      options={values.map((value) => ({
        value,
        label: `Durée ${value} ans`,
      }))}
    />
  );
}

export default ImpactEvaluationPeriodSelect;
