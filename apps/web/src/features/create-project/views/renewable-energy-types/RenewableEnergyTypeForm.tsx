import { useForm, UseFormRegister } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import {
  getPrevisionalEnrSocioEconomicImpact,
  RenewableEnergyType,
} from "../../domain/project.types";
import { getLabelForRenewableEnergyType } from "../projectTypeLabelMapping";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

type Props = {
  onSubmit: (data: FormValues) => void;
  siteSurfaceArea: number;
};

type FormValues = {
  renewableEnergyTypes: RenewableEnergyType[];
};

const formatNumericImpact = (impact: number) => {
  const signPrefix = impact > 0 ? "+" : "-";
  return `${signPrefix} ${formatNumberFr(Math.abs(impact))}`;
};

const allowedRenewableEnergyTypesErrorMessage = `Cette fonctionnalité n’est pas encore accessible, veuillez sélectionner uniquement l’option ${getLabelForRenewableEnergyType(
  RenewableEnergyType.PHOTOVOLTAIC,
)}`;

const validateSelectedRenewableEnergyTypes = (renewableEnergyTypes: RenewableEnergyType[]) =>
  (renewableEnergyTypes.length === 1 &&
    renewableEnergyTypes[0] === RenewableEnergyType.PHOTOVOLTAIC) ||
  allowedRenewableEnergyTypesErrorMessage;

const mapOptions =
  (register: UseFormRegister<FormValues>, siteSurfaceArea: number) =>
  (enrTypes: RenewableEnergyType) => {
    const potentialImpact = getPrevisionalEnrSocioEconomicImpact(enrTypes, siteSurfaceArea);
    const hintColor = potentialImpact > 0 ? "--text-default-success" : "--text-default-error";
    return {
      label: getLabelForRenewableEnergyType(enrTypes),
      hintText: (
        <div style={{ color: `var(${hintColor})` }}>
          {formatNumericImpact(potentialImpact)} € / an d’impacts socio-économiques potentiels
        </div>
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

const options = [
  RenewableEnergyType.PHOTOVOLTAIC,
  RenewableEnergyType.AGRIVOLTAIC,
  RenewableEnergyType.GEOTHERMAL,
  RenewableEnergyType.BIOMASS,
];

function RenewableEnergyTypesForm({ onSubmit, siteSurfaceArea }: Props) {
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
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </WizardFormLayout>
  );
}

export default RenewableEnergyTypesForm;
