import { useForm, UseFormRegister } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import {
  getPrevisionalEnrSocioEconomicImpact,
  RenewableEnergyType,
} from "../../domain/project.types";
import { getLabelForRenewableEnergyType } from "../projectTypeLabelMapping";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

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

const mapOptions =
  (register: UseFormRegister<FormValues>, siteSurfaceArea: number) =>
  (enrTypes: RenewableEnergyType) => {
    const potentialImpact = getPrevisionalEnrSocioEconomicImpact(
      enrTypes,
      siteSurfaceArea,
    );
    const hintColor =
      potentialImpact > 0 ? "--text-default-success" : "--text-default-error";
    return {
      label: getLabelForRenewableEnergyType(enrTypes),
      hintText: (
        <div style={{ color: `var(${hintColor})` }}>
          {formatNumericImpact(potentialImpact)} € / an d’impacts
          socio-économiques potentiels
        </div>
      ),
      nativeInputProps: {
        ...register("renewableEnergyTypes", {
          required:
            "Ce champ est nécessaire pour déterminer les questions suivantes",
        }),
        value: enrTypes,
        disabled: enrTypes !== RenewableEnergyType.PHOTOVOLTAIC,
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

  return (
    <>
      <h2>Quel système d’EnR souhaitez-vous installer ?</h2>
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

export default RenewableEnergyTypesForm;
