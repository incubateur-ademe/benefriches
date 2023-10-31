import { useForm, UseFormRegister } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { RenewableEnergyType } from "../../domain/project.types";
import { getLabelForRenewableEnergyType } from "../projectTypeLabelMapping";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type FormValues = {
  renewableEnergyTypes: RenewableEnergyType[];
};

const mapOptions =
  (register: UseFormRegister<FormValues>) =>
  (enrTypes: RenewableEnergyType) => {
    return {
      label: getLabelForRenewableEnergyType(enrTypes),
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

function RenewableEnergyTypesForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const validationError = formState.errors.renewableEnergyTypes;

  return (
    <>
      <h2>Quel système d’EnR souhaitez-vous installer ?</h2>
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

export default RenewableEnergyTypesForm;
