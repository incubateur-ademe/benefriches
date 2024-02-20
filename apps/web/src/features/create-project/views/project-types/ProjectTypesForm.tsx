import { useForm, UseFormRegister } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import {
  DevelopmentPlanCategory,
  getPrevisionalProjectSocioEconomicImpact,
} from "../../domain/project.types";
import { getLabelForDevelopmentPlanCategory } from "../projectTypeLabelMapping";

import AboutFormsModal from "@/shared/app-settings/views/AboutFormsModal";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  siteSurfaceArea: number;
};

type FormValues = {
  developmentPlanCategories: DevelopmentPlanCategory[];
};

const formatNumericImpact = (impact: number) => {
  const signPrefix = impact > 0 ? "+" : "-";
  return `${signPrefix} ${formatNumberFr(Math.abs(impact))}`;
};

const allowedProjectTypesErrorMessage = `Cette fonctionnalité n’est pas encore accessible, veuillez sélectionner uniquement l’option ${getLabelForDevelopmentPlanCategory(
  "RENEWABLE_ENERGY",
)}`;

const validateSelectedProjectTypes = (developmentPlanCategories: DevelopmentPlanCategory[]) =>
  (developmentPlanCategories.length === 1 && developmentPlanCategories[0] === "RENEWABLE_ENERGY") ||
  allowedProjectTypesErrorMessage;

const mapOptions =
  (register: UseFormRegister<FormValues>, siteSurfaceArea: number) =>
  (projectType: DevelopmentPlanCategory) => {
    const potentialImpact = getPrevisionalProjectSocioEconomicImpact(projectType, siteSurfaceArea);
    const hintColor = potentialImpact > 0 ? "--text-default-success" : "--text-default-error";

    return {
      label: getLabelForDevelopmentPlanCategory(projectType),
      hintText: (
        <div style={{ color: `var(${hintColor})` }}>
          {formatNumericImpact(potentialImpact)} € / an d’impacts socio-économiques potentiels
        </div>
      ),
      nativeInputProps: {
        ...register("developmentPlanCategories", {
          required: "Ce champ est nécessaire pour déterminer les questions suivantes",
          validate: {
            allowedProjectTypes: validateSelectedProjectTypes,
          },
        }),
        value: projectType,
      },
    };
  };

const options = [
  "BUILDINGS",
  "NATURAL_URBAN_SPACES",
  "URBAN_AGRICULTURE",
  "RENEWABLE_ENERGY",
] as const;

function ProjectTypesForm({ onSubmit, siteSurfaceArea }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const validationError = formState.errors.developmentPlanCategories;

  const state =
    validationError && validationError.type !== "allowedProjectTypes" ? "error" : "default";

  return (
    <>
      <AboutFormsModal />
      <WizardFormLayout
        title="Que souhaitez-vous aménager sur ce site ?"
        instructions={
          <p>
            Votre projet peut contenir plusieurs aménagements, toutefois il s’agit de l’usage
            principal qui doit être renseigné.
          </p>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Checkbox
            options={options.map(mapOptions(register, siteSurfaceArea))}
            state={state}
            stateRelatedMessage={validationError ? validationError.message : undefined}
          />
          <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
        </form>
      </WizardFormLayout>
    </>
  );
}

export default ProjectTypesForm;
