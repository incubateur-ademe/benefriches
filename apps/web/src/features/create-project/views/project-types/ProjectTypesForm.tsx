import { useForm, UseFormRegister } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import {
  getPrevisionalProjectSocioEconomicImpact,
  ProjectType,
} from "../../domain/project.types";
import { getLabelForProjectType } from "../projectTypeLabelMapping";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  onSubmit: (data: FormValues) => void;
  siteSurfaceArea: number;
};

type FormValues = {
  types: ProjectType[];
};

const formatNumericImpact = (impact: number) => {
  const signPrefix = impact > 0 ? "+" : "-";
  return `${signPrefix} ${formatNumberFr(Math.abs(impact))}`;
};

const mapOptions =
  (register: UseFormRegister<FormValues>, siteSurfaceArea: number) =>
  (projectType: ProjectType) => {
    const potentialImpact = getPrevisionalProjectSocioEconomicImpact(
      projectType,
      siteSurfaceArea,
    );
    const hintColor =
      potentialImpact > 0 ? "--text-default-success" : "--text-default-error";

    return {
      label: getLabelForProjectType(projectType),
      hintText: (
        <div style={{ color: `var(${hintColor})` }}>
          {formatNumericImpact(potentialImpact)} € / an d’impacts
          socio-économiques potentiels
        </div>
      ),
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

function ProjectTypesForm({ onSubmit, siteSurfaceArea }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const validationError = formState.errors.types;

  return (
    <>
      <h2>Qu’y aura t-il sur le site une fois aménagé ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox
          options={options.map(mapOptions(register, siteSurfaceArea))}
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
