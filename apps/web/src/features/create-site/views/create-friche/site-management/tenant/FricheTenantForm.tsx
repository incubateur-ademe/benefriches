import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type hasTenantStringOption = "yes" | "no";

export type FormValues = {
  hasTenant: hasTenantStringOption;
  tenantBusinessName?: string;
};

const requiredMessage = "Ce champ est requis";

function FricheTenantForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const hasTenantError = formState.errors.hasTenant;
  const tenantBusinessName = formState.errors.tenantBusinessName;

  const _options = [
    {
      label: "Non/NSP",
      nativeInputProps: {
        value: "no",
        ...register("hasTenant", { required: requiredMessage }),
      },
    },
    {
      label: "Oui",
      nativeInputProps: {
        value: "yes",
        ...register("hasTenant", { required: requiredMessage }),
      },
    },
  ];

  return (
    <>
      <h2>La friche est-elle encore louée par un exploitant ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          options={_options}
          state={hasTenantError ? "error" : "default"}
          stateRelatedMessage={
            hasTenantError ? hasTenantError.message : undefined
          }
        />
        {watch("hasTenant") === "yes" && (
          <Input
            label="Raison sociale de l'exploitant"
            state={tenantBusinessName ? "error" : "default"}
            stateRelatedMessage={
              tenantBusinessName ? tenantBusinessName.message : undefined
            }
            nativeInputProps={{
              ...register("tenantBusinessName", {
                required: requiredMessage,
              }),
            }}
          />
        )}
        <Button nativeButtonProps={{ type: "submit" }}>Suivant</Button>
      </form>
    </>
  );
}

export default FricheTenantForm;
