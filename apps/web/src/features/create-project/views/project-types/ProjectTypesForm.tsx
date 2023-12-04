import { useForm, UseFormRegister } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import {
  getPrevisionalProjectSocioEconomicImpact,
  ProjectType,
} from "../../domain/project.types";
import { getLabelForProjectType } from "../projectTypeLabelMapping";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

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

const allowedProjectTypesErrorMessage = `Cette fonctionnalité n’est pas encore accessible, veuillez sélectionner uniquement l’option ${getLabelForProjectType(
  ProjectType.RENEWABLE_ENERGY,
)}`;

const validateSelectedProjectTypes = (types: ProjectType[]) =>
  (types.length === 1 && types[0] === ProjectType.RENEWABLE_ENERGY) ||
  allowedProjectTypesErrorMessage;

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
          validate: {
            allowedProjectTypes: validateSelectedProjectTypes,
          },
        }),
        value: projectType,
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

  const state =
    validationError && validationError.type !== "allowedProjectTypes"
      ? "error"
      : "default";

  return (
    <WizardFormLayout
      title="Quel est l’usage principal prévu sur le site ?"
      instructions={
        <p>
          Votre projet peut contenir plusieurs aménagements, toutefois il s’agit
          de l’usage principal qui doit être renseigné.
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox
          options={options.map(mapOptions(register, siteSurfaceArea))}
          state={state}
          stateRelatedMessage={
            validationError ? validationError.message : undefined
          }
        />
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default ProjectTypesForm;
