import { useForm } from "react-hook-form";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";

import { OperationStatus } from "@/features/create-site/domain/naturalArea.types";

type Props = {
  onSubmit: (formData: FormValues) => void;
  ownerName?: string;
};

type FormValues = {
  operationStatus: OperationStatus;
  otherCompanyName?: string;
};

const requiredMessage =
  "Ce champ est nécessaire pour déterminer les questions suivantes";

function NaturalAreaOperatingCompanyForm({ onSubmit, ownerName }: Props) {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>();

  const getOptions = () => {
    const defaultOptions = [
      {
        label: "Non",
        nativeInputProps: {
          value: OperationStatus.NOT_OPERATED,
          ...register("operationStatus", { required: requiredMessage }),
        },
      },
      {
        label: "NSP",
        nativeInputProps: {
          value: OperationStatus.UNKNOWN,
          ...register("operationStatus", { required: requiredMessage }),
        },
      },
    ];

    if (ownerName) {
      return [
        {
          label: `Oui, par ${ownerName}`,
          nativeInputProps: {
            value: OperationStatus.OPERATED_BY_OWNER,
            ...register("operationStatus", { required: requiredMessage }),
          },
        },
        {
          label: "Oui, par une autre entreprise",
          nativeInputProps: {
            value: OperationStatus.OPERATED_BY_OTHER_COMPANY,
            ...register("operationStatus", { required: requiredMessage }),
          },
        },
        ...defaultOptions,
      ];
    }
    return [
      {
        label: "Oui",
        nativeInputProps: {
          value: OperationStatus.OPERATED_BY_OTHER_COMPANY,
          ...register("operationStatus", { required: requiredMessage }),
        },
      },
      ...defaultOptions,
    ];
  };

  const options = getOptions();

  const error = formState.errors.operationStatus;

  return (
    <>
      <h2>L'espace naturel est-il exploité ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          options={options}
          state={error ? "error" : "default"}
          stateRelatedMessage={error ? error.message : undefined}
        />
        {watch("operationStatus") ===
          OperationStatus.OPERATED_BY_OTHER_COMPANY && (
          <Input
            label=""
            nativeInputProps={{
              placeholder: "Nom de l'exploitant",
              ...register("otherCompanyName", {
                required: "Ce champ est requis",
              }),
            }}
          />
        )}
        <ButtonsGroup
          buttonsEquisized
          inlineLayoutWhen="always"
          buttons={[
            {
              children: "Suivant",
              nativeButtonProps: { type: "submit" },
            },
          ]}
        />
      </form>
    </>
  );
}

export default NaturalAreaOperatingCompanyForm;
