import { useForm, UseFormRegister } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { ProjectType } from "../../domain/project.types";
import { getLabelForProjectType } from "../projectTypeLabelMapping";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  types: ProjectType[];
};

const mapOptions =
  (register: UseFormRegister<FormValues>) => (projectType: ProjectType) => {
    return {
      label: getLabelForProjectType(projectType),
      nativeInputProps: {
        ...register("types", {
          required:
            "Ce champ est nécessaire pour déterminer les questions suivantes",
        }),
        value: projectType,
        disabled: projectType !== ProjectType.RENEWABLE_ENERGY,
      },
    };
  };

const options = [
  ProjectType.BUILDINGS,
  ProjectType.NATURAL_URBAN_SPACES,
  ProjectType.URBAN_AGRICULTURE,
  ProjectType.RENEWABLE_ENERGY,
];

function ProjectTypesForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const validationError = formState.errors.types;

  return (
    <>
      <h2>Qu’y aura t-il sur la friche une fois aménagée ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox
          options={options.map(mapOptions(register))}
          state={validationError ? "error" : "default"}
          stateRelatedMessage={
            validationError ? validationError.message : undefined
          }
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default ProjectTypesForm;
