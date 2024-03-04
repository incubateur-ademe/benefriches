import { useForm, UseFormRegister } from "react-hook-form";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import {
  getPrevisionalEnrSocioEconomicImpact,
  RenewableEnergyDevelopmentPlanType,
} from "../../domain/project.types";
import {
  getDescriptionForRenewableEnergyType,
  getLabelForRenewableEnergyProductionType,
} from "../projectTypeLabelMapping";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
  siteSurfaceArea: number;
};

type FormValues = {
  renewableEnergyTypes: RenewableEnergyDevelopmentPlanType[];
};

const formatNumericImpact = (impact: number) => {
  const signPrefix = impact > 0 ? "+" : "-";
  return `${signPrefix} ${formatNumberFr(Math.abs(impact))}`;
};

const allowedRenewableEnergyTypesErrorMessage = `Cette fonctionnalité n’est pas encore accessible, veuillez sélectionner uniquement l’option ${getLabelForRenewableEnergyProductionType(
  "PHOTOVOLTAIC_POWER_PLANT",
)}`;

const validateSelectedRenewableEnergyTypes = (
  renewableEnergyTypes: RenewableEnergyDevelopmentPlanType[],
) =>
  (renewableEnergyTypes.length === 1 && renewableEnergyTypes[0] === "PHOTOVOLTAIC_POWER_PLANT") ||
  allowedRenewableEnergyTypesErrorMessage;

const mapOptions =
  (register: UseFormRegister<FormValues>, siteSurfaceArea: number) =>
  (enrTypes: RenewableEnergyDevelopmentPlanType) => {
    const potentialImpact = getPrevisionalEnrSocioEconomicImpact(enrTypes, siteSurfaceArea);
    const hintColor = potentialImpact > 0 ? "--text-default-success" : "--text-default-error";
    return {
      label: getLabelForRenewableEnergyProductionType(enrTypes),
      hintText: (
        <>
          <legend>{getDescriptionForRenewableEnergyType(enrTypes)}</legend>
          <div style={{ color: `var(${hintColor})` }}>
            {formatNumericImpact(potentialImpact)} € / an d’impacts socio-économiques potentiels
          </div>
        </>
      ),
      nativeInputProps: {
        ...register("renewableEnergyTypes", {
          required: "Ce champ est nécessaire pour déterminer les questions suivantes",
          validate: {
            allowedRenewableEnergyTypes: validateSelectedRenewableEnergyTypes,
          },
        }),
        value: enrTypes,
      },
    };
  };

const options = ["PHOTOVOLTAIC_POWER_PLANT", "AGRIVOLTAIC", "GEOTHERMAL", "BIOMASS"] as const;

function RenewableEnergyTypesForm({ onSubmit, siteSurfaceArea, onBack }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const validationError = formState.errors.renewableEnergyTypes;

  const state =
    validationError && validationError.type !== "allowedRenewableEnergyTypes" ? "error" : "default";

  return (
    <WizardFormLayout
      title="Quel système d’EnR souhaitez-vous installer ?"
      instructions={
        <p>
          Votre projet peut contenir plusieurs systèmes de production d’énergies renouvelables ;
          plusieurs réponses sont donc possibles.
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Checkbox
          options={options.map(mapOptions(register, siteSurfaceArea))}
          state={state}
          stateRelatedMessage={validationError ? validationError.message : undefined}
        />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default RenewableEnergyTypesForm;
