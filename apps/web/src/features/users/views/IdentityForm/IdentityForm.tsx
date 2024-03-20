import { useForm } from "react-hook-form";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import { Input } from "@codegouvfr/react-dsfr/Input";

import BackNextButtonsGroup from "@/shared/views/components/BackNextButtons/BackNextButtons";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

export type FormValues = {
  lastname: string;
  firstname: string;
  email: string;
  description?: string;
  consent: boolean;
};

type Props = {
  onSubmit: (data: FormValues) => void;
  onBack: () => void;
};

function IdentityForm({ onSubmit, onBack }: Props) {
  const { register, handleSubmit } = useForm<FormValues>();

  return (
    <WizardFormLayout title="Dénomination du site">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Nom" nativeInputProps={register("lastname")} />
        <Input label="Prénom" nativeInputProps={register("lastname")} />
        <Input label="Email" nativeInputProps={register("email")} />
        <Checkbox options={[{ label: "", nativeInputProps: { value: "consent" } }]} />
        <BackNextButtonsGroup onBack={onBack} />
      </form>
    </WizardFormLayout>
  );
}

export default IdentityForm;
