import Select from "@codegouvfr/react-dsfr/SelectNext";

const values = ["10"] as const;

function ProjectDurationSelect() {
  return (
    <Select
      label=""
      disabled
      nativeSelectProps={{
        value: "10",
      }}
      options={values.map((value) => ({
        value,
        label: `Durée ${value} ans`,
      }))}
    />
  );
}

export default ProjectDurationSelect;
