import Select from "@codegouvfr/react-dsfr/SelectNext";

const values = ["10", "20", "30"] as const;

type Props = {
  value: number;
  onChange: (n: number) => void;
};

function ImpactEvaluationPeriodSelect({ value, onChange }: Props) {
  return (
    <Select
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
