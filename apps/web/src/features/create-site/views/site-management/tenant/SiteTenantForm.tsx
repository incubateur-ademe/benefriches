import { useForm } from "react-hook-form";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";

import RadioButtons from "@/shared/views/components/RadioButtons/RadioButtons";

type Props = {
  onSubmit: (data: FormValues) => void;
};

type hasTenantStringOption = "yes" | "no";

export type FormValues = {
  hasTenant: hasTenantStringOption;
  tenantBusinessName?: string;
};

const requiredMessage = "Ce champ est requis";

function SiteTenantForm({ onSubmit }: Props) {
  const { register, handleSubmit, formState, watch } = useForm<FormValues>({
    shouldUnregister: true,
  });

  const hasTenantError = formState.errors.hasTenant;
  const tenantBusinessName = formState.errors.tenantBusinessName;

  const options = [
    {
      label: "Non/NSP",
      value: "no",
    },
    {
      label: "Oui",
      value: "yes",
    },
  ];

  return (
    <>
      <h2>Le site est-il encore louée par un exploitant ?</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButtons
          {...register("hasTenant", { required: requiredMessage })}
          options={options}
          error={hasTenantError}
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

export default SiteTenantForm;
